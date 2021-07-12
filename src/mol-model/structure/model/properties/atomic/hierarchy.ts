/**
 * Copyright (c) 2017-2019 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { Column, Table } from '../../../../../mol-data/db';
import { Segmentation } from '../../../../../mol-data/int';
import { mmCIF_Schema as mmCIF } from '../../../../../mol-io/reader/cif/schema/mmcif';
import { ElementSymbol, MoleculeType, PolymerType } from '../../types';
import { ChainIndex, EntityIndex, ResidueIndex, ElementIndex } from '../../indexing';
import { SortedRanges } from '../../../../../mol-data/int/sorted-ranges';

export const AtomsSchema = {
    /**
     * The chemical element of this atom site.
     * For mmCIF files, this points to atom_type.symbol in the ATOM_TYPE category.
     */
    type_symbol: Column.Schema.Aliased<ElementSymbol>(mmCIF.atom_site.type_symbol),
    /**
     * A component of the identifier for this atom site.
     * This is a standardized name for the atom within its residue.
     * For mmCIF files, this points to chem_comp_atom.atom_id in the CHEM_COMP_ATOM category.
     */
    label_atom_id: mmCIF.atom_site.label_atom_id,
    /**
     * An alternative identifier for label_atom_id that may be provided by an author
     * in order to match the identification used in the publication that describes the structure.
     */
    auth_atom_id: mmCIF.atom_site.auth_atom_id,
    /**
     * A component of the identifier for this atom site.
     * Identifies an alternative conformation for this atom site.
     */
    label_alt_id: mmCIF.atom_site.label_alt_id,
    /**
     * A component of the identifier for this atom site.
     * For mmCIF files, this points to chem_comp.id in the CHEM_COMP category.
     */
    label_comp_id: mmCIF.atom_site.label_comp_id,
    /**
     * An alternative identifier for atom_site.label_comp_id that may be provided by an author
     * in order to match the identification used in the publication that describes the structure.
     */
    auth_comp_id: mmCIF.atom_site.auth_comp_id,
    /**
     * The net integer charge assigned to this atom.
     * This is the formal charge assignment normally found in chemical diagrams.
     */
    pdbx_formal_charge: mmCIF.atom_site.pdbx_formal_charge,

    // id, occupancy and B_iso_or_equiv are part of conformation
};

export type AtomsSchema = typeof AtomsSchema
export type Atoms = Table<AtomsSchema>

export const ResiduesSchema = {
    /**
     * The group of atoms to which the atom site belongs. This data item is provided for
     * compatibility with the original Protein Data Bank format, and only for that purpose.
     */
    group_PDB: mmCIF.atom_site.group_PDB,
    /**
     * For mmCIF files, this points to entity_poly_seq.num in the ENTITY_POLY_SEQ category.
     */
    label_seq_id: mmCIF.atom_site.label_seq_id,
    /**
     * An alternative identifier for atom_site.label_seq_id that may be provided by an author
     * in order to match the identification used in the publication that describes the structure.
     */
    auth_seq_id: mmCIF.atom_site.auth_seq_id,
    /**
     * PDB insertion code.
     */
    pdbx_PDB_ins_code: mmCIF.atom_site.pdbx_PDB_ins_code,

    // comp_id is part of atoms because of microheterogeneity
};
export type ResiduesSchema = typeof ResiduesSchema
export type Residues = Table<ResiduesSchema>

export const ChainsSchema = {
    /**
     * A component of the identifier for this atom site.
     * For mmCIF files, this points to struct_asym.id in the STRUCT_ASYM category.
     */
    label_asym_id: mmCIF.atom_site.label_asym_id,
    /**
     * An alternative identifier for atomsite.label_asym_id that may be provided by an author
     * in order to match the identification used in the publication that describes the structure.
     */
    auth_asym_id: mmCIF.atom_site.auth_asym_id,
    /**
     * For mmCIF files, this points to _entity.id in the ENTITY category.
     */
    label_entity_id: mmCIF.atom_site.label_entity_id
};
export type ChainsSchema = typeof ChainsSchema
export type Chains = Table<ChainsSchema>

export interface AtomicData {
    atoms: Atoms,
    /**
     * The index of this atom in the input data.
     * Required because of sorting of atoms.
     */
    atomSourceIndex: Column<number>,
    residues: Residues,
    chains: Chains
}

export interface AtomicDerivedData {
    readonly atom: {
        readonly atomicNumber: ArrayLike<number>
    },
    readonly residue: {
        readonly traceElementIndex: ArrayLike<ElementIndex | -1>
        readonly directionFromElementIndex: ArrayLike<ElementIndex | -1>
        readonly directionToElementIndex: ArrayLike<ElementIndex | -1>
        readonly moleculeType: ArrayLike<MoleculeType>
        readonly polymerType: ArrayLike<PolymerType>
    }
}

export interface AtomicSegments {
    /** Maps residueIndex to a range of atoms [segments[rI], segments[rI + 1]) */
    residueAtomSegments: Segmentation<ElementIndex, ResidueIndex>,
    /**
     * Maps chainIndex to a range of atoms [segments[cI], segments[cI + 1]),
     *
     * residues of i-th chain are accessed like this:
     * const rI = residueAtomSegments.index, offsets = chainAtomSegments.offsets;
     * const start = rI[offsets[i]], const end = rI[offsets[i + 1] - 1] + 1;
     * for (let j = start; j < end; i++) { }
     */
    chainAtomSegments: Segmentation<ElementIndex, ChainIndex>,

    // TODO: include entity segments?
}

export interface AtomicIndex {
    /** @returns index or -1 if not present. */
    getEntityFromChain(cI: ChainIndex): EntityIndex,
    /** @returns index or -1 if not present. */
    findEntity(label_asym_id: string): EntityIndex

    /**
     * Find chain using label_ mmCIF properties
     * @returns index or -1 if not present.
     */
    findChainLabel(key: AtomicIndex.ChainLabelKey): ChainIndex,
    /**
     * Find chain using auth_ mmCIF properties
     * @returns index or -1 if not present.
     */
    findChainAuth(key: AtomicIndex.ChainAuthKey): ChainIndex,

    /**
     * Index of the 1st occurence of this residue.
     * auth_seq_id is used because label_seq_id is undefined for "ligands" in mmCIF.
     * @param key.pdbx_PDB_ins_code Empty string for undefined
     * @returns index or -1 if not present.
     */
    findResidue(key: AtomicIndex.ResidueKey): ResidueIndex,
    findResidue(label_entity_id: string, label_asym_id: string, auth_seq_id: string, pdbx_PDB_ins_code?: string): ResidueIndex,

    /**
     * Index of the 1st occurence of this residue.
     * @param key.pdbx_PDB_ins_code Empty string for undefined
     * @returns index or -1 if not present.
     */
    findResidueAuth(key: AtomicIndex.ResidueAuthKey): ResidueIndex,

    /**
     * Find the residue index where the spefied residue should be inserted to maintain the ordering (entity_id, asym_id, seq_id, ins_code).
     * Useful for determining ranges for sequence-level annotations.
     * @param key.pdbx_PDB_ins_code Use empty string for undefined
     */
    findResidueInsertion(key: AtomicIndex.ResidueLabelKey): ResidueIndex,

    /**
     * Find element index of an atom.
     * @param key
     * @returns index or -1 if the atom is not present.
     */
    findAtom(key: AtomicIndex.AtomKey): ElementIndex,

    /**
     * Find element index of an atom.
     * @param key
     * @returns index or -1 if the atom is not present.
     */
    findAtomAuth(key: AtomicIndex.AtomAuthKey): ElementIndex,

    /**
     * Find element index of an atom on a given residue.
     * @returns index or -1 if the atom is not present.
     */
    findAtomOnResidue(residueIndex: ResidueIndex, label_atom_id: string, label_alt_id?: string): ElementIndex

    /**
     * Find element index of any given atom on a given residue.
     * @returns first found index or -1 if none of the given atoms are present.
     */
    findAtomsOnResidue(residueIndex: ResidueIndex, label_atom_ids: Set<string>): ElementIndex

    // TODO: add indices that support comp_id?
}

export namespace AtomicIndex {
    export interface ChainLabelKey { label_entity_id: string, label_asym_id: string }
    export interface ChainAuthKey { auth_asym_id: string, auth_seq_id: string }

    export interface ResidueKey { label_entity_id: string, label_asym_id: string, auth_seq_id: string, pdbx_PDB_ins_code?: string }
    export function EmptyResidueKey(): ResidueKey { return { label_entity_id: '', label_asym_id: '', auth_seq_id: '', pdbx_PDB_ins_code: void 0 }; }

    export interface ResidueAuthKey { auth_asym_id: string, auth_comp_id: string, auth_seq_id: string, pdbx_PDB_ins_code?: string }
    export interface ResidueLabelKey { label_entity_id: string, label_asym_id: string, label_seq_id: number, pdbx_PDB_ins_code?: string }

    export interface AtomKey extends ResidueKey { label_atom_id: string, label_alt_id?: string }
    export interface AtomAuthKey extends ResidueAuthKey { auth_atom_id: string, label_alt_id?: string }
}

export interface AtomicRanges {
    polymerRanges: SortedRanges<ElementIndex>
    gapRanges: SortedRanges<ElementIndex>
    cyclicPolymerMap: Map<ResidueIndex, ResidueIndex>
}

type _Hierarchy = AtomicData & AtomicSegments
export interface AtomicHierarchy extends _Hierarchy {
    index: AtomicIndex
    derived: AtomicDerivedData
}

export namespace AtomicHierarchy {
    /** Start residue inclusive */
    export function chainStartResidueIndex(segs: AtomicSegments, cI: ChainIndex) {
        return segs.residueAtomSegments.index[segs.chainAtomSegments.offsets[cI]];
    }

    /** End residue exclusive */
    export function chainEndResidueIndexExcl(segs: AtomicSegments, cI: ChainIndex) {
        return segs.residueAtomSegments.index[segs.chainAtomSegments.offsets[cI + 1] - 1] + 1 as ResidueIndex;
    }

    export function chainResidueCount(segs: AtomicSegments, cI: ChainIndex) {
        return chainEndResidueIndexExcl(segs, cI) - chainStartResidueIndex(segs, cI);
    }
}
