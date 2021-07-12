/**
 * Copyright (c) 2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { Column, Table } from '../../mol-data/db';
import { Model, Symmetry } from '../../mol-model/structure/model';
import { MoleculeType, BondType } from '../../mol-model/structure/model/types';
import { RuntimeContext, Task } from '../../mol-task';
import { createModels } from './basic/parser';
import { BasicSchema, createBasic } from './basic/schema';
import { ComponentBuilder } from './common/component';
import { EntityBuilder } from './common/entity';
import { ModelFormat } from '../format';
import { CifCore_Database } from '../../mol-io/reader/cif/schema/cif-core';
import { CifFrame, CIF } from '../../mol-io/reader/cif';
import { Spacegroup, SpacegroupCell } from '../../mol-math/geometry';
import { Vec3 } from '../../mol-math/linear-algebra';
import { ModelSymmetry } from './property/symmetry';
import { IndexPairBonds } from './property/bonds/index-pair';
import { AtomSiteAnisotrop } from './property/anisotropic';
import { guessElementSymbolString } from './util';
import { Trajectory } from '../../mol-model/structure';
import { cantorPairing } from '../../mol-data/util';

function getSpacegroupNameOrNumber(space_group: CifCore_Database['space_group']) {
    const groupNumber = space_group.IT_number.value(0);
    const groupName = space_group['name_H-M_full'].value(0);
    if (!space_group.IT_number.isDefined) return groupName;
    if (!space_group['name_H-M_full'].isDefined) return groupNumber;
    return groupNumber;
}

function getSymmetry(db: CifCore_Database): Symmetry {
    const { cell, space_group } = db;
    const nameOrNumber = getSpacegroupNameOrNumber(space_group);
    const spaceCell = SpacegroupCell.create(nameOrNumber,
        Vec3.create(cell.length_a.value(0), cell.length_b.value(0), cell.length_c.value(0)),
        Vec3.scale(Vec3(), Vec3.create(cell.angle_alpha.value(0), cell.angle_beta.value(0), cell.angle_gamma.value(0)), Math.PI / 180));

    return {
        spacegroup: Spacegroup.create(spaceCell),
        assemblies : [],
        isNonStandardCrystalFrame: false,
        ncsOperators: []
    };
}

async function getModels(db: CifCore_Database, format: CifCoreFormat, ctx: RuntimeContext) {

    const atomCount = db.atom_site._rowCount;
    const MOL = Column.ofConst('MOL', atomCount, Column.Schema.str);
    const A = Column.ofConst('A', atomCount, Column.Schema.str);
    const seq_id = Column.ofConst(1, atomCount, Column.Schema.int);
    const auth_seq_id = Column.ofConst('1', atomCount, Column.Schema.str);

    const symmetry = getSymmetry(db);
    const m = symmetry.spacegroup.cell.fromFractional;

    const { fract_x, fract_y, fract_z } = db.atom_site;
    const x = new Float32Array(atomCount);
    const y = new Float32Array(atomCount);
    const z = new Float32Array(atomCount);
    const v = Vec3();
    for (let i = 0; i < atomCount; ++i) {
        Vec3.set(v, fract_x.value(i), fract_y.value(i), fract_z.value(i));
        Vec3.transformMat4(v, v, m);
        x[i] = v[0], y[i] = v[1], z[i] = v[2];
    }

    const { type_symbol, label } = db.atom_site;
    let typeSymbol: Column<string>;
    let formalCharge: Column<number>;
    if (type_symbol.isDefined) {
        const element_symbol = new Array<string>(atomCount);
        const formal_charge = new Int8Array(atomCount);
        for (let i = 0; i < atomCount; ++i) {
            const ts = type_symbol.value(i);
            const n = ts.length;
            if (ts[n - 1] === '+') {
                element_symbol[i] = ts.substring(0, n - 2);
                formal_charge[i] = parseInt(ts[n - 2]);
            } else if (ts[n - 2] === '+') {
                element_symbol[i] = ts.substring(0, n - 2);
                formal_charge[i] = parseInt(ts[n - 1]);
            } else if (ts[n - 1] === '-') {
                element_symbol[i] = ts.substring(0, n - 2);
                formal_charge[i] = -parseInt(ts[n - 2]);
            } else if (ts[n - 2] === '-') {
                element_symbol[i] = ts.substring(0, n - 2);
                formal_charge[i] = -parseInt(ts[n - 1]);
            } else {
                element_symbol[i] = ts;
                formal_charge[i] = 0;
            }
        }
        typeSymbol = Column.ofStringArray(element_symbol);
        formalCharge = Column.ofIntArray(formal_charge);
    } else {
        const element_symbol = new Array<string>(atomCount);
        for (let i = 0; i < atomCount; ++i) {
            // TODO can take as is if type_symbol not given?
            element_symbol[i] = guessElementSymbolString(label.value(i));
        }
        typeSymbol = Column.ofStringArray(element_symbol);
        formalCharge = Column.Undefined(atomCount, Column.Schema.int);
    }

    const atom_site = Table.ofPartialColumns(BasicSchema.atom_site, {
        auth_asym_id: A,
        auth_atom_id: label,
        auth_comp_id: MOL,
        auth_seq_id: auth_seq_id,
        Cartn_x: Column.ofFloatArray(x),
        Cartn_y: Column.ofFloatArray(y),
        Cartn_z: Column.ofFloatArray(z),
        id: Column.range(0, atomCount - 1),

        label_asym_id: A,
        label_atom_id: label,
        label_comp_id: MOL,
        label_seq_id: seq_id,
        label_entity_id: Column.ofConst('1', atomCount, Column.Schema.str),

        occupancy: db.atom_site.occupancy.isDefined
            ? db.atom_site.occupancy
            : Column.ofConst(1, atomCount, Column.Schema.float),
        type_symbol: typeSymbol,
        pdbx_formal_charge: formalCharge,

        pdbx_PDB_model_num: Column.ofConst(1, atomCount, Column.Schema.int),
        B_iso_or_equiv: db.atom_site.U_iso_or_equiv,
    }, atomCount);

    const name = (
        db.chemical.name_common.value(0) ||
        db.chemical.name_systematic.value(0) ||
        db.chemical_formula.sum.value(0)
    );

    const entityBuilder = new EntityBuilder();
    entityBuilder.setNames([['MOL', name || 'Unknown Entity']]);
    entityBuilder.getEntityId('MOL', MoleculeType.Unknown, 'A');

    const componentBuilder = new ComponentBuilder(seq_id, db.atom_site.type_symbol);
    componentBuilder.setNames([['MOL', name || 'Unknown Molecule']]);
    componentBuilder.add('MOL', 0);

    const basics = createBasic({
        entity: entityBuilder.getEntityTable(),
        chem_comp: componentBuilder.getChemCompTable(),
        atom_site
    });

    const models = await createModels(basics, format, ctx);

    if (models.frameCount > 0) {
        const first = models.representative;

        ModelSymmetry.Provider.set(first, symmetry);

        const bondCount = db.geom_bond._rowCount;
        if(bondCount > 0) {
            const labelIndexMap: { [label: string]: number } = {};
            const { label } = db.atom_site;
            for (let i = 0, il = label.rowCount; i < il; ++i) {
                labelIndexMap[label.value(i)] = i;
            }

            const bond_type = format.data.frame.categories.ccdc_geom_bond_type?.getField('');

            const indexA: number[] = [];
            const indexB: number[] = [];
            const order: number[] = [];
            const dist: number[] = [];
            const flag: number[] = [];

            const included = new Set<number>();
            let j = 0;

            const { atom_site_label_1, atom_site_label_2, valence, distance } = db.geom_bond;
            for (let i = 0; i < bondCount; ++i) {
                const iA = labelIndexMap[atom_site_label_1.value(i)];
                const iB = labelIndexMap[atom_site_label_2.value(i)];
                const id = iA < iB ? cantorPairing(iA, iB) : cantorPairing(iB, iA);
                if (included.has(id)) continue;
                included.add(id);

                indexA[j] = iA;
                indexB[j] = iB;
                dist[j] = distance.value(i) || -1;

                if (bond_type) {
                    const t = bond_type.str(i);
                    if (t === 'D') {
                        order[j] = 2;
                        flag[j] = BondType.Flag.Covalent;
                    } else if (t === 'A') {
                        order[j] = 1;
                        flag[j] = BondType.Flag.Covalent | BondType.Flag.Aromatic;
                    } else if (t === 'S') {
                        order[j] = 1;
                        flag[j] = BondType.Flag.Covalent;
                    } else {
                        order[j] = 1;
                        flag[j] = BondType.Flag.Covalent;
                    }
                } else {
                    flag[j] = BondType.Flag.Covalent;
                    // TODO derive order from bond length if undefined
                    order[j] = valence.isDefined ? valence.value(i) : 1;
                }

                j += 1;
            }

            IndexPairBonds.Provider.set(first, IndexPairBonds.fromData({ pairs: {
                indexA: Column.ofIntArray(indexA),
                indexB: Column.ofIntArray(indexB),
                order: Column.ofIntArray(order),
                distance: Column.ofFloatArray(dist),
                flag: Column.ofIntArray(flag)
            }, count: atomCount }));
        }
    }

    return models;
}

function atomSiteAnisotropFromCifCore(model: Model) {
    if (!CifCoreFormat.is(model.sourceData)) return;
    const { atom_site, atom_site_aniso } = model.sourceData.data.db;
    const data = Table.ofPartialColumns(AtomSiteAnisotrop.Schema, {
        U: atom_site_aniso.U,
        U_esd: atom_site_aniso.U_su
    }, atom_site_aniso._rowCount);
    const elementToAnsiotrop = AtomSiteAnisotrop.getElementToAnsiotropFromLabel(atom_site.label, atom_site_aniso.label);
    return { data, elementToAnsiotrop };
}
function atomSiteAnisotropApplicableCifCore(model: Model) {
    if (!CifCoreFormat.is(model.sourceData)) return false;
    return model.sourceData.data.db.atom_site_aniso.U.isDefined;
}
AtomSiteAnisotrop.Provider.formatRegistry.add('cifCore', atomSiteAnisotropFromCifCore, atomSiteAnisotropApplicableCifCore);

//

export { CifCoreFormat };

type CifCoreFormat = ModelFormat<CifCoreFormat.Data>

namespace CifCoreFormat {
    export type Data = { db: CifCore_Database, frame: CifFrame }
    export function is(x?: ModelFormat): x is CifCoreFormat {
        return x?.kind === 'cifCore';
    }

    export function fromFrame(frame: CifFrame, db?: CifCore_Database): CifCoreFormat {
        if (!db) db = CIF.schema.cifCore(frame);

        const name = (
            db.database_code.depnum_ccdc_archive.value(0) ||
            db.database_code.depnum_ccdc_fiz.value(0) ||
            db.database_code.ICSD.value(0) ||
            db.database_code.MDF.value(0) ||
            db.database_code.NBS.value(0) ||
            db.database_code.CSD.value(0) ||
            db.database_code.COD.value(0) ||
            db._name
        );

        return { kind: 'cifCore', name, data: { db, frame } };
    }
}

export function trajectoryFromCifCore(frame: CifFrame): Task<Trajectory> {
    const format = CifCoreFormat.fromFrame(frame);
    return Task.create('Parse CIF Core', ctx => getModels(format.data.db, format, ctx));
}
