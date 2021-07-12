/**
 * Copyright (c) 2019-2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { Model } from '../../mol-model/structure/model';
import { Task } from '../../mol-task';
import { ModelFormat } from '../format';
import { GroFile, GroAtoms } from '../../mol-io/reader/gro/schema';
import { Column, Table } from '../../mol-data/db';
import { guessElementSymbolString } from './util';
import { MoleculeType, getMoleculeType } from '../../mol-model/structure/model/types';
import { ComponentBuilder } from './common/component';
import { getChainId } from './common/util';
import { EntityBuilder } from './common/entity';
import { BasicData, BasicSchema, createBasic } from './basic/schema';
import { createModels } from './basic/parser';
import { Trajectory } from '../../mol-model/structure';
import { ArrayTrajectory } from '../../mol-model/structure/trajectory';

function getBasic(atoms: GroAtoms, modelNum: number): BasicData {
    const auth_atom_id = atoms.atomName;
    const auth_comp_id = atoms.residueName;

    const entityIds = new Array<string>(atoms.count);
    const asymIds = new Array<string>(atoms.count);
    const seqIds = new Uint32Array(atoms.count);
    const ids = new Uint32Array(atoms.count);
    const authSeqIds = new Array<string>(atoms.count);

    const entityBuilder = new EntityBuilder();
    const componentBuilder = new ComponentBuilder(atoms.residueNumber, atoms.atomName);

    let currentEntityId = '';
    let currentAsymIndex = 0;
    let currentAsymId = '';
    let currentSeqId = 0;
    let prevMoleculeType = MoleculeType.Unknown;
    let prevResidueNumber = -1;

    for (let i = 0, il = atoms.count; i < il; ++i) {
        const residueNumber = atoms.residueNumber.value(i);
        if (residueNumber !== prevResidueNumber) {
            const compId = atoms.residueName.value(i);
            const moleculeType = getMoleculeType(componentBuilder.add(compId, i).type, compId);

            if (moleculeType !== prevMoleculeType || (
                residueNumber !== prevResidueNumber + 1 && !(
                    // gro format allows only for 5 character residueNumbers, handle overflow here
                    prevResidueNumber === 99999 && residueNumber === 0
                )
            )) {
                currentAsymId = getChainId(currentAsymIndex);
                currentAsymIndex += 1;
                currentSeqId = 0;
            }

            currentEntityId = entityBuilder.getEntityId(compId, moleculeType, currentAsymId);
            currentSeqId += 1;

            prevResidueNumber = residueNumber;
            prevMoleculeType = moleculeType;
        }

        entityIds[i] = currentEntityId;
        asymIds[i] = currentAsymId;
        seqIds[i] = currentSeqId;
        ids[i] = i;
        authSeqIds[i] = residueNumber.toString();
    }

    const auth_asym_id = Column.ofStringArray(asymIds);

    const atom_site = Table.ofPartialColumns(BasicSchema.atom_site, {
        auth_asym_id,
        auth_atom_id,
        auth_comp_id,
        auth_seq_id: Column.ofStringArray(authSeqIds),
        Cartn_x: Column.ofFloatArray(Column.mapToArray(atoms.x, x => x * 10, Float32Array)),
        Cartn_y: Column.ofFloatArray(Column.mapToArray(atoms.y, y => y * 10, Float32Array)),
        Cartn_z: Column.ofFloatArray(Column.mapToArray(atoms.z, z => z * 10, Float32Array)),
        id: Column.ofIntArray(ids),

        label_asym_id: auth_asym_id,
        label_atom_id: auth_atom_id,
        label_comp_id: auth_comp_id,
        label_seq_id: Column.ofIntArray(seqIds),
        label_entity_id: Column.ofStringArray(entityIds),

        occupancy: Column.ofConst(1, atoms.count, Column.Schema.float),
        type_symbol: Column.ofStringArray(Column.mapToArray(atoms.atomName, s => guessElementSymbolString(s))),

        pdbx_PDB_model_num: Column.ofConst(modelNum, atoms.count, Column.Schema.int),
    }, atoms.count);

    return createBasic({
        entity: entityBuilder.getEntityTable(),
        chem_comp: componentBuilder.getChemCompTable(),
        atom_site
    });
}

//

export { GroFormat };

type GroFormat = ModelFormat<GroFile>

namespace GroFormat {
    export function is(x?: ModelFormat): x is GroFormat {
        return x?.kind === 'gro';
    }

    export function fromGro(gro: GroFile): GroFormat {
        return { kind: 'gro', name: gro.structures[0].header.title, data: gro };
    }
}

// TODO reuse static model parts when hierarchy is identical
//      need to pass all gro.structures as one table into createModels

export function trajectoryFromGRO(gro: GroFile): Task<Trajectory> {
    return Task.create('Parse GRO', async ctx => {
        const format = GroFormat.fromGro(gro);
        const models: Model[] = [];
        for (let i = 0, il = gro.structures.length; i < il; ++i) {
            const basic = getBasic(gro.structures[i].atoms, i + 1);
            const m = await createModels(basic, format, ctx);
            if (m.frameCount === 1) {
                models.push(m.representative);
            }
        }
        return new ArrayTrajectory(models);
    });
}
