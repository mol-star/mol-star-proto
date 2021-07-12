/**
 * Copyright (c) 2018-2020 Mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { Model } from '../../../mol-model/structure/model/model';
import { Table } from '../../../mol-data/db';
import { mmCIF_Schema } from '../../../mol-io/reader/cif/schema/mmcif';
import { Unit } from '../../../mol-model/structure';
import { ElementIndex } from '../../../mol-model/structure/model/indexing';
import { FormatPropertyProvider } from '../../../mol-model-formats/structure/common/property';
import { CustomPropertyDescriptor } from '../../../mol-model/custom-property';

export { ModelCrossLinkRestraint };

interface ModelCrossLinkRestraint {
    getIndicesByElement: (element: ElementIndex, kind: Unit.Kind) => number[]
    data: Table<mmCIF_Schema['ihm_cross_link_restraint']>
}

namespace ModelCrossLinkRestraint {
    export const Descriptor: CustomPropertyDescriptor = {
        name: 'ihm_cross_link_restraint',
        // TODO cifExport
    };

    export const Provider = FormatPropertyProvider.create<ModelCrossLinkRestraint>(Descriptor);

    export function fromTable(table: Table<mmCIF_Schema['ihm_cross_link_restraint']>, model: Model): ModelCrossLinkRestraint {

        const p1 = {
            entity_id: table.entity_id_1,
            asym_id: table.asym_id_1,
            seq_id: table.seq_id_1,
            atom_id: table.atom_id_1,
        };

        const p2: typeof p1 = {
            entity_id: table.entity_id_2,
            asym_id: table.asym_id_2,
            seq_id: table.seq_id_2,
            atom_id: table.atom_id_2,
        };

        function _add(map: Map<ElementIndex, number[]>, element: ElementIndex, row: number) {
            const indices = map.get(element);
            if (indices) indices.push(row);
            else map.set(element, [ row ]);
        }

        function add(row: number, ps: typeof p1) {
            const entityId = ps.entity_id.value(row);
            const asymId = ps.asym_id.value(row);
            const seqId = ps.seq_id.value(row);

            if (table.model_granularity.value(row) === 'by-atom') {
                const atomicElement = model.atomicHierarchy.index.findAtom({
                    auth_seq_id: seqId.toString(),
                    label_asym_id: asymId,
                    label_atom_id: ps.atom_id.value(row),
                    label_entity_id: entityId,
                });
                if (atomicElement >= 0) _add(atomicElementMap, atomicElement as ElementIndex, row);
            } else if (model.coarseHierarchy.isDefined) {
                const sphereElement = model.coarseHierarchy.spheres.findSequenceKey(entityId, asymId, seqId);
                if (sphereElement >= 0) {
                    _add(sphereElementMap, sphereElement, row);
                } else {
                    const gaussianElement = model.coarseHierarchy.gaussians.findSequenceKey(entityId, asymId, seqId);
                    if (gaussianElement >= 0) _add(gaussianElementMap, gaussianElement, row);
                }
            }
        }

        function getMapByKind(kind: Unit.Kind) {
            switch (kind) {
                case Unit.Kind.Atomic: return atomicElementMap;
                case Unit.Kind.Spheres: return sphereElementMap;
                case Unit.Kind.Gaussians: return gaussianElementMap;
            }
        }

        /** map from atomic element to cross link indices */
        const atomicElementMap: Map<ElementIndex, number[]> = new Map();
        /** map from sphere element to cross link indices */
        const sphereElementMap: Map<ElementIndex, number[]> = new Map();
        /** map from gaussian element to cross link indices */
        const gaussianElementMap: Map<ElementIndex, number[]> = new Map();

        const emptyIndexArray: number[] = [];

        for (let i = 0; i < table._rowCount; ++i) {
            add(i, p1);
            add(i, p2);
        }

        return {
            getIndicesByElement: (element: ElementIndex, kind: Unit.Kind) => {
                const map = getMapByKind(kind);
                const idx = map.get(element);
                return idx !== undefined ? idx : emptyIndexArray;
            },
            data: table
        };
    }
}