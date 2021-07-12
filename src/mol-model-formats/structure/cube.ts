/**
 * Copyright (c) 2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */

import { Column, Table } from '../../mol-data/db';
import { MoleculeType, getElementFromAtomicNumber, ElementSymbol } from '../../mol-model/structure/model/types';
import { RuntimeContext, Task } from '../../mol-task';
import { createModels } from './basic/parser';
import { BasicSchema, createBasic } from './basic/schema';
import { ComponentBuilder } from './common/component';
import { EntityBuilder } from './common/entity';
import { ModelFormat } from '../format';
import { CubeFile } from '../../mol-io/reader/cube/parser';
import { Trajectory } from '../../mol-model/structure';

async function getModels(cube: CubeFile, ctx: RuntimeContext) {
    const { atoms } = cube;

    const MOL = Column.ofConst('MOL', cube.atoms.count, Column.Schema.str);
    const A = Column.ofConst('A', cube.atoms.count, Column.Schema.str);
    const type_symbol = Column.ofArray({ array: Column.mapToArray(atoms.number, n => getElementFromAtomicNumber(n)), schema: Column.Schema.Aliased<ElementSymbol>(Column.Schema.str) });
    const seq_id = Column.ofConst(1, atoms.count, Column.Schema.int);
    const auth_seq_id = Column.ofConst('1', atoms.count, Column.Schema.str);

    const atom_site = Table.ofPartialColumns(BasicSchema.atom_site, {
        auth_asym_id: A,
        auth_atom_id: type_symbol,
        auth_comp_id: MOL,
        auth_seq_id: auth_seq_id,
        Cartn_x: Column.asArrayColumn(atoms.x, Float32Array),
        Cartn_y: Column.asArrayColumn(atoms.y, Float32Array),
        Cartn_z: Column.asArrayColumn(atoms.z, Float32Array),
        id: Column.range(0, atoms.count - 1),

        label_asym_id: A,
        label_atom_id: type_symbol,
        label_comp_id: MOL,
        label_seq_id: seq_id,
        label_entity_id: Column.ofConst('1', atoms.count, Column.Schema.str),

        occupancy: Column.ofConst(1, atoms.count, Column.Schema.float),
        type_symbol,

        pdbx_PDB_model_num: Column.ofConst(1, atoms.count, Column.Schema.int),
    }, atoms.count);

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

    return await createModels(basics, MolFormat.create(cube), ctx);
}

//

export { CubeFormat };

type CubeFormat = ModelFormat<CubeFile>

namespace MolFormat {
    export function is(x?: ModelFormat): x is CubeFormat {
        return x?.kind === 'cube';
    }

    export function create(cube: CubeFile): CubeFormat {
        return { kind: 'cube', name: cube.header.comment1, data: cube };
    }
}

export function trajectoryFromCube(cube: CubeFile): Task<Trajectory> {
    return Task.create('Parse Cube', ctx => getModels(cube, ctx));
}
