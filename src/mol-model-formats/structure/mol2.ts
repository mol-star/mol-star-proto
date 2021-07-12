/**
 * Copyright (c) 2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { Column, Table } from '../../mol-data/db';
import { Model } from '../../mol-model/structure/model';
import { BondType, MoleculeType } from '../../mol-model/structure/model/types';
import { RuntimeContext, Task } from '../../mol-task';
import { createModels } from './basic/parser';
import { BasicSchema, createBasic } from './basic/schema';
import { ComponentBuilder } from './common/component';
import { EntityBuilder } from './common/entity';
import { ModelFormat } from '../format';
import { IndexPairBonds } from './property/bonds/index-pair';
import { Mol2File } from '../../mol-io/reader/mol2/schema';
import { AtomPartialCharge } from './property/partial-charge';
import { Trajectory, ArrayTrajectory } from '../../mol-model/structure';
import { guessElementSymbolString } from './util';

async function getModels(mol2: Mol2File, ctx: RuntimeContext) {
    const models: Model[] = [];

    for (let i = 0, il = mol2.structures.length; i < il; ++i) {
        const { atoms, bonds, molecule } = mol2.structures[i];

        const A = Column.ofConst('A', atoms.count, Column.Schema.str);

        const type_symbol = new Array<string>(atoms.count);
        for (let i = 0; i < atoms.count; ++i) {
            type_symbol[i] = guessElementSymbolString(atoms.atom_name.value(i));
        }

        const atom_site = Table.ofPartialColumns(BasicSchema.atom_site, {
            auth_asym_id: A,
            auth_atom_id: Column.asArrayColumn(atoms.atom_name),
            auth_comp_id: atoms.subst_name,
            auth_seq_id: Column.ofStringArray(Column.mapToArray(atoms.subst_id, id => id.toString())),
            Cartn_x: Column.asArrayColumn(atoms.x, Float32Array),
            Cartn_y: Column.asArrayColumn(atoms.y, Float32Array),
            Cartn_z: Column.asArrayColumn(atoms.z, Float32Array),
            id: Column.asArrayColumn(atoms.atom_id),

            label_asym_id: A,
            label_atom_id: Column.asArrayColumn(atoms.atom_name),
            label_comp_id: atoms.subst_name,
            label_seq_id: atoms.subst_id,
            label_entity_id: Column.ofConst('1', atoms.count, Column.Schema.str),

            occupancy: Column.ofConst(1, atoms.count, Column.Schema.float),
            type_symbol: Column.ofStringArray(type_symbol),

            pdbx_PDB_model_num: Column.ofConst(i, atoms.count, Column.Schema.int),
        }, atoms.count);

        const entityBuilder = new EntityBuilder();
        entityBuilder.setNames([['MOL', molecule.mol_name || 'Unknown Entity']]);
        entityBuilder.getEntityId('MOL', MoleculeType.Unknown, 'A');

        const componentBuilder = new ComponentBuilder(atoms.subst_id, atoms.atom_name);
        for (let i = 0, il = atoms.subst_name.rowCount; i < il; ++i) {
            componentBuilder.add(atoms.subst_name.value(i), i);
        }

        const basics = createBasic({
            entity: entityBuilder.getEntityTable(),
            chem_comp: componentBuilder.getChemCompTable(),
            atom_site
        });

        const _models = await createModels(basics, Mol2Format.create(mol2), ctx);

        if (_models.frameCount > 0) {
            const indexA = Column.ofIntArray(Column.mapToArray(bonds.origin_atom_id, x => x - 1, Int32Array));
            const indexB = Column.ofIntArray(Column.mapToArray(bonds.target_atom_id, x => x - 1, Int32Array));
            const order = Column.ofIntArray(Column.mapToArray(bonds.bond_type, x => {
                switch (x) {
                    case 'ar': // aromatic
                    case 'am': // amide
                    case 'un': // unknown
                        return 1;
                    case 'du': // dummy
                    case 'nc': // not connected
                        return 0;
                    default:
                        return parseInt(x);
                }
            }, Int8Array));
            const flag = Column.ofIntArray(Column.mapToArray(bonds.bond_type, x => {
                switch (x) {
                    case 'ar': // aromatic
                        return BondType.Flag.Aromatic | BondType.Flag.Covalent;
                    case 'du': // dummy
                    case 'nc': // not connected
                        return BondType.Flag.None;
                    case 'am': // amide
                    case 'un': // unknown
                    default:
                        return BondType.Flag.Covalent;
                }
            }, Int8Array));
            const pairBonds = IndexPairBonds.fromData({ pairs: { indexA, indexB, order, flag }, count: atoms.count });

            const first = _models.representative;
            IndexPairBonds.Provider.set(first, pairBonds);

            AtomPartialCharge.Provider.set(first, {
                data: atoms.charge,
                type: molecule.charge_type
            });

            models.push(first);
        }
    }

    return new ArrayTrajectory(models);
}

//

export { Mol2Format };

type Mol2Format = ModelFormat<Mol2File>

namespace Mol2Format {
    export function is(x?: ModelFormat): x is Mol2Format {
        return x?.kind === 'mol2';
    }

    export function create(mol2: Mol2File): Mol2Format {
        return { kind: 'mol2', name: mol2.name, data: mol2 };
    }
}

export function trajectoryFromMol2(mol2: Mol2File): Task<Trajectory> {
    return Task.create('Parse MOL2', ctx => getModels(mol2, ctx));
}
