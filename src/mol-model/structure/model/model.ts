/**
 * Copyright (c) 2017 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */

import UUID from 'mol-util/uuid'
import Format from './format'
import Sequence from './properties/sequence'
import Hierarchy from './properties/hierarchy'
import AtomSiteConformation from './properties/atom-site-conformation'
import Symmetry from './properties/symmetry'
import CoarseGrained from './properties/coarse-grained'
import { Entities } from './properties/common';

import from_gro from './formats/gro'
import from_mmCIF from './formats/mmcif'

/**
 * Interface to the "source data" of the molecule.
 *
 * "Atoms" are integers in the range [0, atomCount).
 */
interface Model extends Readonly<{
    id: UUID,

    modelNum: number,

    sourceData: Format,

    entities: Entities,
    sequence: Sequence,

    hierarchy: Hierarchy,
    atomSiteConformation: AtomSiteConformation,
    symmetry: Symmetry,
    coarseGrained: CoarseGrained,

    atomCount: number,
}> {

} { }

namespace Model {
    export function create(format: Format) {
        switch (format.kind) {
            case 'gro': return from_gro(format);
            case 'mmCIF': return from_mmCIF(format);
        }
    }
    // export function spatialLookup(model: Model): GridLookup {
    //     if (model['@spatialLookup']) return model['@spatialLookup']!;
    //     const lookup = GridLookup(model.conformation);
    //     model['@spatialLookup'] = lookup;
    //     return lookup;
    // }
    // export function bonds(model: Model): Bonds {
    //     if (model['@bonds']) return model['@bonds']!;
    //     const bonds = computeBonds(model);
    //     model['@bonds'] = bonds;
    //     return bonds;
    // }
}

export default Model