/**
 * Copyright (c) 2017-2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { AtomicData, AtomicSegments } from '../atomic';
import { Interval, Segmentation, SortedArray } from '../../../../../mol-data/int';
import { Entities } from '../common';
import { ChainIndex, ResidueIndex, EntityIndex, ElementIndex } from '../../indexing';
import { AtomicIndex, AtomicHierarchy } from '../atomic/hierarchy';
import { cantorPairing } from '../../../../../mol-data/util';
import { Column } from '../../../../../mol-data/db';

function getResidueId(seq_id: number, ins_code: string) {
    if (!ins_code) return seq_id;
    if (ins_code.length === 1) return cantorPairing(ins_code.charCodeAt(0), seq_id);
    if (ins_code.length === 2) return cantorPairing(ins_code.charCodeAt(0), cantorPairing(ins_code.charCodeAt(1), seq_id));
    return `${seq_id} ${ins_code}`;
}

function getResidueIdAuth(auth_id: string, ins_code: string) {
    return `${auth_id}*${ins_code}`; // Use asterisk to distinguish between ids generated from numbers and strings
}

function updateMapMapIndex<K, I extends number>(map: Map<K, Map<string, I>>, key0: K, key1: string, index: I) {
    if (map.has(key0)) {
        const submap = map.get(key0)!;
        if (!submap.has(key1)) {
            submap.set(key1, index);
        }
    } else {
        const submap = new Map<string, I>();
        map.set(key0, submap);
        submap.set(key1, index);
    }
}

function missingEntity(k: string) {
    throw new Error(`Missing entity entry for entity id '${k}'.`);
}

interface Mapping {
    entities: Entities,
    label_seq_id: SortedArray,
    label_atom_id: Column<string>,
    auth_atom_id: Column<string>,
    label_alt_id: Column<string>,
    segments: AtomicSegments,

    chain_index_entity_index: EntityIndex[],

    entity_index_label_asym_id: Map<EntityIndex, Map<string, ChainIndex>>,
    chain_index_label_seq_id: Map<ChainIndex, Map<string | number, ResidueIndex>>,

    auth_asym_id_auth_seq_id: Map<string, Map<string, ChainIndex>>,
    chain_index_auth_seq_id: Map<ChainIndex, Map<string, ResidueIndex>>,

    label_asym_id: Map<string, EntityIndex>,
}

function createMapping(entities: Entities, data: AtomicData, segments: AtomicSegments): Mapping {
    return {
        entities,
        segments,
        label_seq_id: SortedArray.ofSortedArray(data.residues.label_seq_id.toArray({ array: Int32Array })),
        label_atom_id: data.atoms.label_atom_id,
        auth_atom_id: data.atoms.auth_atom_id,
        label_alt_id: data.atoms.label_alt_id,
        chain_index_entity_index: new Int32Array(data.chains._rowCount) as any,
        entity_index_label_asym_id: new Map(),
        chain_index_label_seq_id: new Map(),
        auth_asym_id_auth_seq_id: new Map(),
        chain_index_auth_seq_id: new Map(),
        label_asym_id: new Map(),
    };
}

const _tempResidueKey = AtomicIndex.EmptyResidueKey();
class Index implements AtomicIndex {
    private entityIndex: Entities['getEntityIndex'];
    private residueOffsets: ArrayLike<ElementIndex>;

    getEntityFromChain(cI: ChainIndex): EntityIndex {
        return this.map.chain_index_entity_index[cI];
    }

    findEntity(label_asym_id: string): EntityIndex {
        const entityIndex = this.map.label_asym_id.get(label_asym_id);
        return entityIndex !== undefined ? entityIndex : -1 as EntityIndex;
    }

    findChainLabel(key: AtomicIndex.ChainLabelKey): ChainIndex {
        const eI = this.entityIndex(key.label_entity_id);
        if (eI < 0 || !this.map.entity_index_label_asym_id.has(eI)) return -1 as ChainIndex;
        const cm = this.map.entity_index_label_asym_id.get(eI);
        if (!cm) return -1 as ChainIndex;
        return cm.has(key.label_asym_id) ? cm.get(key.label_asym_id)! : -1 as ChainIndex;
    }

    findChainAuth(key: AtomicIndex.ChainAuthKey): ChainIndex {
        if (!this.map.auth_asym_id_auth_seq_id.has(key.auth_asym_id)) return -1 as ChainIndex;
        const rm = this.map.auth_asym_id_auth_seq_id.get(key.auth_asym_id)!;
        return rm.has(key.auth_seq_id) ? rm.get(key.auth_seq_id)! : -1 as ChainIndex;
    }

    findResidue(label_entity_id: string, label_asym_id: string, auth_seq_id: string, pdbx_PDB_ins_code?: string): ResidueIndex
    findResidue(key: AtomicIndex.ResidueKey): ResidueIndex
    findResidue(label_entity_id_or_key: string | AtomicIndex.ResidueKey, label_asym_id?: string, auth_seq_id?: string, pdbx_PDB_ins_code?: string): ResidueIndex {
        let key: AtomicIndex.ResidueKey;
        if (arguments.length === 1) {
            key = label_entity_id_or_key as AtomicIndex.ResidueKey;
        } else {
            _tempResidueKey.label_entity_id = label_entity_id_or_key as string;
            _tempResidueKey.label_asym_id = label_asym_id!;
            _tempResidueKey.auth_seq_id = auth_seq_id!;
            _tempResidueKey.pdbx_PDB_ins_code = pdbx_PDB_ins_code;
            key = _tempResidueKey;
        }
        const cI = this.findChainLabel(key);
        if (cI < 0) return -1 as ResidueIndex;
        const rm = this.map.chain_index_auth_seq_id.get(cI)!;
        const id = getResidueIdAuth(key.auth_seq_id, key.pdbx_PDB_ins_code || '');
        return rm.has(id) ? rm.get(id)! : -1 as ResidueIndex;
    }

    findResidueAuth(key: AtomicIndex.ResidueAuthKey): ResidueIndex {
        const cI = this.findChainAuth(key);
        if (cI < 0) return -1 as ResidueIndex;
        const rm = this.map.chain_index_auth_seq_id.get(cI)!;
        const id = getResidueIdAuth(key.auth_seq_id, key.pdbx_PDB_ins_code || '');
        return rm.has(id) ? rm.get(id)! : -1 as ResidueIndex;
    }

    findResidueInsertion(key: AtomicIndex.ResidueLabelKey): ResidueIndex {
        const cI = this.findChainLabel(key);
        if (cI < 0) return -1 as ResidueIndex;
        const rm = this.map.chain_index_label_seq_id.get(cI)!;
        const id = getResidueId(key.label_seq_id, key.pdbx_PDB_ins_code || '');
        if (rm.has(id)) return rm.get(id)!;

        const idx = SortedArray.findPredecessorIndex(this.map.label_seq_id, key.label_seq_id) as ResidueIndex;
        const start = AtomicHierarchy.chainStartResidueIndex(this.map.segments, cI);
        if (idx < start) return start;
        const end = AtomicHierarchy.chainEndResidueIndexExcl(this.map.segments, cI) - 1 as ResidueIndex;
        if (idx >= end) return end;
        return idx;
    }

    findAtom(key: AtomicIndex.AtomKey): ElementIndex {
        const rI = this.findResidue(key);
        if (rI < 0) return -1 as ElementIndex;
        if (typeof key.label_alt_id === 'undefined') {
            return findAtomByName(this.residueOffsets[rI], this.residueOffsets[rI + 1], this.map.label_atom_id, key.label_atom_id);
        }
        return findAtomByNameAndAltLoc(this.residueOffsets[rI], this.residueOffsets[rI + 1], this.map.label_atom_id, this.map.label_alt_id, key.label_atom_id, key.label_alt_id);
    }

    findAtomAuth(key: AtomicIndex.AtomAuthKey): ElementIndex {
        const rI = this.findResidueAuth(key);
        if (rI < 0) return -1 as ElementIndex;
        if (typeof key.label_alt_id === 'undefined') {
            return findAtomByName(this.residueOffsets[rI], this.residueOffsets[rI + 1], this.map.auth_atom_id, key.auth_atom_id);
        }
        return findAtomByNameAndAltLoc(this.residueOffsets[rI], this.residueOffsets[rI + 1], this.map.auth_atom_id, this.map.label_alt_id, key.auth_atom_id, key.label_alt_id);
    }

    findAtomOnResidue(rI: ResidueIndex, label_atom_id: string, label_alt_id?: string) {
        if (typeof label_alt_id === 'undefined') {
            return findAtomByName(this.residueOffsets[rI], this.residueOffsets[rI + 1], this.map.label_atom_id, label_atom_id);
        }
        return findAtomByNameAndAltLoc(this.residueOffsets[rI], this.residueOffsets[rI + 1], this.map.label_atom_id, this.map.label_alt_id, label_atom_id, label_alt_id);
    }

    findAtomsOnResidue(rI: ResidueIndex, label_atom_ids: Set<string>) {
        return findAtomByNames(this.residueOffsets[rI], this.residueOffsets[rI + 1], this.map.label_atom_id, label_atom_ids);
    }

    constructor(private map: Mapping) {
        this.entityIndex = map.entities.getEntityIndex;
        this.residueOffsets = this.map.segments.residueAtomSegments.offsets;
    }
}

function findAtomByName(start: ElementIndex, end: ElementIndex, data: Column<string>, atomName: string): ElementIndex {
    for (let i = start; i < end; i++) {
        if (data.value(i) === atomName) return i;
    }
    return -1 as ElementIndex;
}

function findAtomByNames(start: ElementIndex, end: ElementIndex, data: Column<string>, atomNames: Set<string>): ElementIndex {
    for (let i = start; i < end; i++) {
        if (atomNames.has(data.value(i))) return i;
    }
    return -1 as ElementIndex;
}

function findAtomByNameAndAltLoc(start: ElementIndex, end: ElementIndex, nameData: Column<string>, altLocData: Column<string>,
    atomName: string, altLoc: string): ElementIndex {
    for (let i = start; i < end; i++) {
        if (nameData.value(i) === atomName && altLocData.value(i) === altLoc) return i;
    }
    return -1 as ElementIndex;
}

export function getAtomicIndex(data: AtomicData, entities: Entities, segments: AtomicSegments): AtomicIndex {
    const map = createMapping(entities, data, segments);

    const { label_seq_id, auth_seq_id, pdbx_PDB_ins_code } = data.residues;
    const { label_entity_id, label_asym_id, auth_asym_id } = data.chains;

    const atomSet = Interval.ofBounds(0, data.atoms._rowCount);
    const chainsIt = Segmentation.transientSegments(segments.chainAtomSegments, atomSet);
    while (chainsIt.hasNext) {
        const chainSegment = chainsIt.move();
        const chainIndex = chainSegment.index;

        const entityIndex = entities.getEntityIndex(label_entity_id.value(chainIndex));
        if (entityIndex < 0) missingEntity(label_entity_id.value(chainIndex));
        map.chain_index_entity_index[chainIndex] = entityIndex;

        const authAsymId = auth_asym_id.value(chainIndex);
        let auth_asym_id_auth_seq_id = map.auth_asym_id_auth_seq_id.get(authAsymId);
        if (!auth_asym_id_auth_seq_id) {
            auth_asym_id_auth_seq_id = new Map<string, ChainIndex>();
            map.auth_asym_id_auth_seq_id.set(authAsymId, auth_asym_id_auth_seq_id);
        }

        const labelAsymId = label_asym_id.value(chainIndex);
        if (!map.label_asym_id.has(labelAsymId)) map.label_asym_id.set(labelAsymId, entityIndex);
        updateMapMapIndex(map.entity_index_label_asym_id, entityIndex, labelAsymId, chainIndex);

        const chain_index_label_seq_id = new Map<string | number, ResidueIndex>();
        const chain_index_auth_seq_id = new Map<string, ResidueIndex>();
        map.chain_index_label_seq_id.set(chainIndex, chain_index_label_seq_id);
        map.chain_index_auth_seq_id.set(chainIndex, chain_index_auth_seq_id);

        const residuesIt = Segmentation.transientSegments(segments.residueAtomSegments, atomSet, chainSegment);
        while (residuesIt.hasNext) {
            const residueSegment = residuesIt.move();
            const rI = residueSegment.index;
            const authSeqId = auth_seq_id.value(rI);
            const insCode = pdbx_PDB_ins_code.value(rI);
            chain_index_label_seq_id.set(getResidueId(label_seq_id.value(rI), insCode), rI);
            chain_index_auth_seq_id.set(getResidueIdAuth(authSeqId, insCode), rI);
            auth_asym_id_auth_seq_id.set(authSeqId, chainIndex);
        }
    }

    return new Index(map);
}