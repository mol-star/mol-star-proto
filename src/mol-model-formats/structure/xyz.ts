/**
 * Copyright (c) 2021 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */

import { Column, Table } from '../../mol-data/db';
import { XyzFile } from '../../mol-io/reader/xyz/parser';
import { Trajectory } from '../../mol-model/structure';
import { MoleculeType } from '../../mol-model/structure/model/types';
import { RuntimeContext, Task } from '../../mol-task';
import { ModelFormat } from '../format';
import { createModels } from './basic/parser';
import { BasicSchema, createBasic } from './basic/schema';
import { ComponentBuilder } from './common/component';
import { EntityBuilder } from './common/entity';

function getModels(mol: XyzFile, ctx: RuntimeContext) {
    const { molecules } = mol;

    let count = 0;
    for (const m of molecules) count += m.count;

    const type_symbols = new Array<string>(count);
    const id = new Int32Array(count);
    const x = new Float32Array(count);
    const y = new Float32Array(count);
    const z = new Float32Array(count);
    const model_num = new Int32Array(count);

    let offset = 0;
    for (let i = 0; i < molecules.length; i++) {
        const m = molecules[i];
        for (let j = 0; j < m.count; j++) {
            type_symbols[offset] = m.type_symbol.value(j);
            x[offset] = m.x.value(j);
            y[offset] = m.y.value(j);
            z[offset] = m.z.value(j);
            id[offset] = j;
            model_num[offset] = i;
            offset++;
        }
    }

    const MOL = Column.ofConst('MOL', count, Column.Schema.str);
    const A = Column.ofConst('A', count, Column.Schema.str);
    const seq_id = Column.ofConst(1, count, Column.Schema.int);

    const type_symbol = Column.ofStringArray(type_symbols);

    const atom_site = Table.ofPartialColumns(BasicSchema.atom_site, {
        auth_asym_id: A,
        auth_atom_id: type_symbol,
        auth_comp_id: MOL,
        auth_seq_id: Column.ofStringArray(Column.mapToArray(seq_id, id => id.toString())),
        Cartn_x: Column.ofFloatArray(x),
        Cartn_y: Column.ofFloatArray(y),
        Cartn_z: Column.ofFloatArray(z),
        id: Column.ofIntArray(id),

        label_asym_id: A,
        label_atom_id: type_symbol,
        label_comp_id: MOL,
        label_seq_id: seq_id,
        label_entity_id: Column.ofConst('1', count, Column.Schema.str),

        occupancy: Column.ofConst(1, count, Column.Schema.float),
        type_symbol,

        pdbx_PDB_model_num: Column.ofIntArray(model_num),
    }, count);

    const entityBuilder = new EntityBuilder();
    entityBuilder.setNames([['MOL', 'Unknown Entity']]);
    entityBuilder.getEntityId('MOL', MoleculeType.Unknown, 'A');

    const componentBuilder = new ComponentBuilder(seq_id, type_symbol);
    componentBuilder.setNames([['MOL', 'Unknown Molecule']]);
    componentBuilder.add('MOL', 0);

    const basics = createBasic({
        entity: entityBuilder.getEntityTable(),
        chem_comp: componentBuilder.getChemCompTable(),
        atom_site
    });

    return createModels(basics, XyzFormat.create(mol), ctx);
}

//

export { XyzFormat };

type XyzFormat = ModelFormat<XyzFile>

namespace XyzFormat {
    export function is(x?: ModelFormat): x is XyzFormat {
        return x?.kind === 'xyz';
    }

    export function create(mol: XyzFile): XyzFormat {
        return { kind: 'xyz', name: 'xyz', data: mol };
    }
}

export function trajectoryFromXyz(mol: XyzFile): Task<Trajectory> {
    return Task.create('Parse XYZ', ctx => getModels(mol, ctx));
}
