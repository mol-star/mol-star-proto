/**
 * Copyright (c) 2017-2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * Code-generated 'mmCIF' schema file. Dictionary versions: mmCIF 5.333, IHM 1.12, CARB draft.
 *
 * @author molstar/ciftools package
 */

import { Database, Column } from '../../../../mol-data/db';

import Schema = Column.Schema;

const str = Schema.str;
const int = Schema.int;
const float = Schema.float;
const coord = Schema.coord;
const Aliased = Schema.Aliased;
const Matrix = Schema.Matrix;
const Vector = Schema.Vector;
const List = Schema.List;

export const mmCIF_Schema = {
    /**
     * Data items in the ATOM_SITE category record details about
     * the atom sites in a macromolecular crystal structure, such as
     * the positional coordinates, atomic displacement parameters,
     * magnetic moments and directions.
     *
     * The data items for describing anisotropic atomic
     * displacement factors are only used if the corresponding items
     * are not given in the ATOM_SITE_ANISOTROP category.
     */
    atom_site: {
        /**
         * An alternative identifier for _atom_site.label_asym_id that
         * may be provided by an author in order to match the identification
         * used in the publication that describes the structure.
         */
        auth_asym_id: str,
        /**
         * An alternative identifier for _atom_site.label_atom_id that
         * may be provided by an author in order to match the identification
         * used in the publication that describes the structure.
         */
        auth_atom_id: str,
        /**
         * An alternative identifier for _atom_site.label_comp_id that
         * may be provided by an author in order to match the identification
         * used in the publication that describes the structure.
         */
        auth_comp_id: str,
        /**
         * An alternative identifier for _atom_site.label_seq_id that
         * may be provided by an author in order to match the identification
         * used in the publication that describes the structure.
         *
         * Note that this is not necessarily a number, that the values do
         * not have to be positive, and that the value does not have to
         * correspond to the value of _atom_site.label_seq_id. The value
         * of _atom_site.label_seq_id is required to be a sequential list
         * of positive integers.
         *
         * The author may assign values to _atom_site.auth_seq_id in any
         * desired way. For instance, the values may be used to relate
         * this structure to a numbering scheme in a homologous structure,
         * including sequence gaps or insertion codes. Alternatively, a
         * scheme may be used for a truncated polymer that maintains the
         * numbering scheme of the full length polymer. In all cases, the
         * scheme used here must match the scheme used in the publication
         * that describes the structure.
         */
        auth_seq_id: str,
        /**
         * Isotropic atomic displacement parameter, or equivalent isotropic
         * atomic displacement parameter, B~eq~, calculated from the
         * anisotropic displacement parameters.
         *
         * B~eq~ = (1/3) sum~i~[sum~j~(B^ij^ A~i~ A~j~ a*~i~ a*~j~)]
         *
         * A     = the real space cell lengths
         * a*    = the reciprocal space cell lengths
         * B^ij^ = 8 pi^2^ U^ij^
         *
         * Ref: Fischer, R. X. & Tillmanns, E. (1988). Acta Cryst. C44,
         * 775-776.
         *
         * The IUCr Commission on Nomenclature recommends against the use
         * of B for reporting atomic displacement parameters. U, being
         * directly proportional to B, is preferred.
         *
         * Note -
         *
         * The particular type of ADP stored in this item is qualified
         * by item _refine.pdbx_adp_type.
         */
        B_iso_or_equiv: float,
        /**
         * The x atom-site coordinate in angstroms specified according to
         * a set of orthogonal Cartesian axes related to the cell axes as
         * specified by the description given in
         * _atom_sites.Cartn_transform_axes.
         */
        Cartn_x: coord,
        /**
         * The y atom-site coordinate in angstroms specified according to
         * a set of orthogonal Cartesian axes related to the cell axes as
         * specified by the description given in
         * _atom_sites.Cartn_transform_axes.
         */
        Cartn_y: coord,
        /**
         * The z atom-site coordinate in angstroms specified according to
         * a set of orthogonal Cartesian axes related to the cell axes as
         * specified by the description given in
         * _atom_sites.Cartn_transform_axes.
         */
        Cartn_z: coord,
        /**
         * The group of atoms to which the atom site belongs. This data
         * item is provided for compatibility with the original Protein
         * Data Bank format, and only for that purpose.
         */
        group_PDB: Aliased<'ATOM' | 'HETATM'>(str),
        /**
         * The value of _atom_site.id must uniquely identify a record in the
         * ATOM_SITE list.
         *
         * Note that this item need not be a number; it can be any unique
         * identifier.
         *
         * This data item was introduced to provide compatibility between
         * small-molecule and macromolecular CIFs. In a small-molecule
         * CIF, _atom_site_label is the identifier for the atom. In a
         * macromolecular CIF, the atom identifier is the aggregate of
         * _atom_site.label_alt_id, _atom_site.label_asym_id,
         * _atom_site.label_atom_id, _atom_site.label_comp_id and
         * _atom_site.label_seq_id. For the two types of files to be
         * compatible, a formal identifier for the category had to be
         * introduced that was independent of the different modes of
         * identifying the atoms. For compatibility with older CIFs,
         * _atom_site_label is aliased to _atom_site.id.
         *
         * In general, this aggregate identifier does not uniquely
         * identify an atom site as for non-polymers _atom_site.label_seq_id
         * is '.'.
         */
        id: int,
        /**
         * A place holder to indicate alternate conformation. The alternate conformation
         * can be an entire polymer chain, or several residues or
         * partial residue (several atoms within one residue). If
         * an atom is provided in more than one position, then a
         * non-blank alternate location indicator must be used for
         * each of the atomic positions.
         */
        label_alt_id: str,
        /**
         * A component of the identifier for this atom site.
         * For further details, see the definition of the STRUCT_ASYM
         * category.
         *
         * This data item is a pointer to _struct_asym.id in the
         * STRUCT_ASYM category.
         */
        label_asym_id: str,
        /**
         * A component of the identifier for this atom site.
         *
         * This data item is a pointer to _chem_comp_atom.atom_id in the
         * CHEM_COMP_ATOM category.
         */
        label_atom_id: str,
        /**
         * A component of the identifier for this atom site.
         *
         * This data item is a pointer to _chem_comp.id in the CHEM_COMP
         * category.
         */
        label_comp_id: str,
        /**
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        label_entity_id: str,
        /**
         * This data item is a pointer to _entity_poly_seq.num in the
         * ENTITY_POLY_SEQ category.
         */
        label_seq_id: int,
        /**
         * The fraction of the atom type present at this site.
         * The sum of the occupancies of all the atom types at this site
         * may not exceed 1.0 unless it is a dummy site.
         */
        occupancy: float,
        /**
         * This data item is a pointer to _atom_type.symbol in the
         * ATOM_TYPE category.
         */
        type_symbol: str,
        /**
         * PDB insertion code.
         */
        pdbx_PDB_ins_code: str,
        /**
         * PDB model number.
         */
        pdbx_PDB_model_num: int,
        /**
         * The net integer charge assigned to this atom. This is the
         * formal charge assignment normally found in chemical diagrams.
         */
        pdbx_formal_charge: int,
        /**
         * The model id corresponding to the atom site.
         * This data item is a pointer to _ihm_model_list.model_id
         * in the IHM_MODEL_LIST category.
         */
        ihm_model_id: int,
    },
    /**
     * Data items in the ATOM_SITE_ANISOTROP category record details
     * about anisotropic displacement parameters.
     * If the ATOM_SITE_ANISOTROP category is used for storing these
     * data, the corresponding ATOM_SITE data items are not used.
     */
    atom_site_anisotrop: {
        /**
         * This data item is a pointer to _atom_site.id in the ATOM_SITE
         * category.
         */
        id: int,
        /**
         * This data item is a pointer to _atom_type.symbol in the
         * ATOM_TYPE category.
         */
        type_symbol: str,
        /**
         * The elements of the standard anisotropic atomic
         * displacement matrix U, which appears in the structure-factor
         * term as:
         *
         * T = exp{-2 pi^2^ sum~i~[sum~j~(U^ij^ h~i~ h~j~ a*~i~ a*~j~)]}
         *
         * h  = the Miller indices
         * a* = the reciprocal space cell lengths
         *
         * These matrix elements may appear with atomic coordinates
         * in the ATOM_SITE category, or they may appear in the separate
         * ATOM_SITE_ANISOTROP category, but they may not appear in both
         * places. Similarly, anisotropic displacements may appear as
         * either B's or U's, but not as both.
         *
         * The unique elements of the real symmetric matrix are
         * entered by row.
         */
        U: Matrix(3, 3),
        /**
         * The standard uncertainty (estimated standard deviation)
         * of _atom_site_anisotrop.U.
         */
        U_esd: Matrix(3, 3),
        /**
         * Pointer to _atom_site.auth_seq_id
         */
        pdbx_auth_seq_id: str,
        /**
         * Pointer to _atom_site.auth_asym_id
         */
        pdbx_auth_asym_id: str,
        /**
         * Pointer to _atom_site.auth_atom_id
         */
        pdbx_auth_atom_id: str,
        /**
         * Pointer to _atom_site.auth_comp_id
         */
        pdbx_auth_comp_id: str,
        /**
         * Pointer to _atom_site.label_seq_id
         */
        pdbx_label_seq_id: int,
        /**
         * Pointer to _atom_site.label_alt_id.
         */
        pdbx_label_alt_id: str,
        /**
         * Pointer to _atom_site.label_asym_id
         */
        pdbx_label_asym_id: str,
        /**
         * Pointer to _atom_site.label_atom_id
         */
        pdbx_label_atom_id: str,
        /**
         * Pointer to _atom_site.label_comp_id
         */
        pdbx_label_comp_id: str,
        /**
         * Pointer to _atom_site.pdbx_PDB_ins_code
         */
        pdbx_PDB_ins_code: str,
    },
    /**
     * Data items in the ATOM_SITES category record details about
     * the crystallographic cell and cell transformations, which are
     * common to all atom sites.
     */
    atom_sites: {
        /**
         * This data item is a pointer to _entry.id in the ENTRY category.
         */
        entry_id: str,
        /**
         * The elements of the 3x3 matrix used to transform Cartesian
         * coordinates in the ATOM_SITE category to fractional coordinates
         * in the same category. The axial alignments of this
         * transformation are described in _atom_sites.Cartn_transform_axes.
         * The 3x1 translation is defined in
         * _atom_sites.fract_transf_vector[].
         *
         * |x'|               |11 12 13| |x|              |1|
         * |y'|~fractional~ = |21 22 23| |y|~Cartesian~ + |2|
         * |z'|               |31 32 33| |z|              |3|
         */
        fract_transf_matrix: Matrix(3, 3),
        /**
         * The elements of the three-element vector used to transform
         * Cartesian coordinates in the ATOM_SITE category to fractional
         * coordinates in the same category. The axial alignments of this
         * transformation are described in _atom_sites.Cartn_transform_axes.
         * The 3x3 rotation is defined in
         * _atom_sites.fract_transf_matrix[][].
         *
         * |x'|               |11 12 13| |x|              |1|
         * |y'|~fractional~ = |21 22 23| |y|~Cartesian~ + |2|
         * |z'|               |31 32 33| |z|              |3|
         */
        fract_transf_vector: Vector(3),
    },
    /**
     * Data items in the AUDIT_AUTHOR category record details about
     * the author(s) of the data block.
     */
    audit_author: {
        /**
         * The name of an author of this data block. If there are multiple
         * authors, _audit_author.name is looped with _audit_author.address.
         * The family name(s), followed by a comma and including any
         * dynastic components, precedes the first name(s) or initial(s).
         */
        name: str,
        /**
         * This data item defines the order of the author's name in the
         * list of audit authors.
         */
        pdbx_ordinal: int,
        /**
         * The Open Researcher and Contributor ID (ORCID).
         */
        identifier_ORCID: str,
    },
    /**
     * Data items in the AUDIT_CONFORM category describe the
     * dictionary versions against which the data names appearing in
     * the current data block are conformant.
     */
    audit_conform: {
        /**
         * A file name or uniform resource locator (URL) for the
         * dictionary to which the current data block conforms.
         */
        dict_location: str,
        /**
         * The string identifying the highest-level dictionary defining
         * data names used in this file.
         */
        dict_name: str,
        /**
         * The version number of the dictionary to which the current
         * data block conforms.
         */
        dict_version: str,
    },
    /**
     * Data items in the CELL category record details about the
     * crystallographic cell parameters.
     */
    cell: {
        /**
         * Unit-cell angle alpha of the reported structure in degrees.
         */
        angle_alpha: float,
        /**
         * Unit-cell angle beta of the reported structure in degrees.
         */
        angle_beta: float,
        /**
         * Unit-cell angle gamma of the reported structure in degrees.
         */
        angle_gamma: float,
        /**
         * This data item is a pointer to _entry.id in the ENTRY category.
         */
        entry_id: str,
        /**
         * Unit-cell length a corresponding to the structure reported in
         * angstroms.
         */
        length_a: float,
        /**
         * Unit-cell length b corresponding to the structure reported in
         * angstroms.
         */
        length_b: float,
        /**
         * Unit-cell length c corresponding to the structure reported in
         * angstroms.
         */
        length_c: float,
        /**
         * The number of the polymeric chains in a unit cell. In the case
         * of heteropolymers, Z is the number of occurrences of the most
         * populous chain.
         *
         * This data item is provided for compatibility with the original
         * Protein Data Bank format, and only for that purpose.
         */
        Z_PDB: int,
        /**
         * To further identify unique axis if necessary.  E.g., P 21 with
         * an unique C axis will have 'C' in this field.
         */
        pdbx_unique_axis: str,
    },
    /**
     * Data items in the CHEM_COMP category give details about each
     * of the chemical components from which the relevant chemical
     * structures can be constructed, such as name, mass or charge.
     *
     * The related categories CHEM_COMP_ATOM, CHEM_COMP_BOND,
     * CHEM_COMP_ANGLE etc. describe the detailed geometry of these
     * chemical components.
     */
    chem_comp: {
        /**
         * The formula for the chemical component. Formulae are written
         * according to the following rules:
         *
         * (1) Only recognized element symbols may be used.
         *
         * (2) Each element symbol is followed by a 'count' number. A count
         * of '1' may be omitted.
         *
         * (3) A space or parenthesis must separate each cluster of
         * (element symbol + count), but in general parentheses are
         * not used.
         *
         * (4) The order of elements depends on whether carbon is
         * present or not. If carbon is present, the order should be:
         * C, then H, then the other elements in alphabetical order
         * of their symbol. If carbon is not present, the elements
         * are listed purely in alphabetic order of their symbol. This
         * is the 'Hill' system used by Chemical Abstracts.
         */
        formula: str,
        /**
         * Formula mass in daltons of the chemical component.
         */
        formula_weight: float,
        /**
         * The value of _chem_comp.id must uniquely identify each item in
         * the CHEM_COMP list.
         *
         * For protein polymer entities, this is the three-letter code for
         * the amino acid.
         *
         * For nucleic acid polymer entities, this is the one-letter code
         * for the base.
         */
        id: str,
        /**
         * 'yes' indicates that this is a 'standard' monomer, 'no'
         * indicates that it is 'nonstandard'. Nonstandard monomers
         * should be described in more detail using the
         * _chem_comp.mon_nstd_parent, _chem_comp.mon_nstd_class and
         * _chem_comp.mon_nstd_details data items.
         */
        mon_nstd_flag: Aliased<'no' | 'n' | 'yes' | 'y'>(str),
        /**
         * The full name of the component.
         */
        name: str,
        /**
         * For standard polymer components, the type of the monomer.
         * Note that monomers that will form polymers are of three types:
         * linking monomers, monomers with some type of N-terminal (or 5')
         * cap and monomers with some type of C-terminal (or 3') cap.
         */
        type: Aliased<'D-peptide linking' | 'L-peptide linking' | 'D-peptide NH3 amino terminus' | 'L-peptide NH3 amino terminus' | 'D-peptide COOH carboxy terminus' | 'L-peptide COOH carboxy terminus' | 'DNA linking' | 'RNA linking' | 'L-RNA linking' | 'L-DNA linking' | 'DNA OH 5 prime terminus' | 'RNA OH 5 prime terminus' | 'DNA OH 3 prime terminus' | 'RNA OH 3 prime terminus' | 'D-saccharide, beta linking' | 'D-saccharide, alpha linking' | 'L-saccharide, beta linking' | 'L-saccharide, alpha linking' | 'L-saccharide' | 'D-saccharide' | 'saccharide' | 'non-polymer' | 'peptide linking' | 'peptide-like' | 'L-gamma-peptide, C-delta linking' | 'D-gamma-peptide, C-delta linking' | 'L-beta-peptide, C-gamma linking' | 'D-beta-peptide, C-gamma linking' | 'other'>(str),
        /**
         * Synonym list for the component.
         */
        pdbx_synonyms: List(';', x => x),
    },
    /**
     * Data items in the CHEM_COMP_BOND category record details about
     * the bonds between atoms in a chemical component. Target values
     * may be specified as bond orders, as a distance between the two
     * atoms, or both.
     */
    chem_comp_bond: {
        /**
         * The ID of the first of the two atoms that define the bond.
         *
         * This data item is a pointer to _chem_comp_atom.atom_id in the
         * CHEM_COMP_ATOM category.
         */
        atom_id_1: str,
        /**
         * The ID of the second of the two atoms that define the bond.
         *
         * This data item is a pointer to _chem_comp_atom.atom_id in the
         * CHEM_COMP_ATOM category.
         */
        atom_id_2: str,
        /**
         * This data item is a pointer to _chem_comp.id in the CHEM_COMP
         * category.
         */
        comp_id: str,
        /**
         * The value that should be taken as the target for the chemical
         * bond associated with the specified atoms, expressed as a bond
         * order.
         */
        value_order: Aliased<'sing' | 'doub' | 'trip' | 'quad' | 'arom' | 'poly' | 'delo' | 'pi'>(str),
        /**
         * Ordinal index for the component bond list.
         */
        pdbx_ordinal: int,
        /**
         * Stereochemical configuration across a double bond.
         */
        pdbx_stereo_config: Aliased<'E' | 'Z' | 'N'>(str),
        /**
         * A flag indicating an aromatic bond.
         */
        pdbx_aromatic_flag: Aliased<'Y' | 'N'>(str),
    },
    /**
     * Data items in the CITATION category record details about the
     * literature cited as being relevant to the contents of the data
     * block.
     */
    citation: {
        /**
         * The name of the publisher of the citation; relevant
         * for books or book chapters.
         */
        book_publisher: str,
        /**
         * The country/region of publication; relevant for books
         * and book chapters.
         */
        country: str,
        /**
         * The value of _citation.id must uniquely identify a record in the
         * CITATION list.
         *
         * The _citation.id 'primary' should be used to indicate the
         * citation that the author(s) consider to be the most pertinent to
         * the contents of the data block.
         *
         * Note that this item need not be a number; it can be any unique
         * identifier.
         */
        id: str,
        /**
         * Abbreviated name of the cited journal as given in the
         * Chemical Abstracts Service Source Index.
         */
        journal_abbrev: str,
        /**
         * The American Society for Testing and Materials (ASTM) code
         * assigned to the journal cited (also referred to as the CODEN
         * designator of the Chemical Abstracts Service); relevant for
         * journal articles.
         */
        journal_id_ASTM: str,
        /**
         * The Cambridge Structural Database (CSD) code assigned to the
         * journal cited; relevant for journal articles. This is also the
         * system used at the Protein Data Bank (PDB).
         */
        journal_id_CSD: str,
        /**
         * The International Standard Serial Number (ISSN) code assigned to
         * the journal cited; relevant for journal articles.
         */
        journal_id_ISSN: str,
        /**
         * Volume number of the journal cited; relevant for journal
         * articles.
         */
        journal_volume: str,
        /**
         * The first page of the citation; relevant for journal
         * articles, books and book chapters.
         */
        page_first: str,
        /**
         * The last page of the citation; relevant for journal
         * articles, books and book chapters.
         */
        page_last: str,
        /**
         * The title of the citation; relevant for journal articles, books
         * and book chapters.
         */
        title: str,
        /**
         * The year of the citation; relevant for journal articles, books
         * and book chapters.
         */
        year: int,
        /**
         * Document Object Identifier used by doi.org to uniquely
         * specify bibliographic entry.
         */
        pdbx_database_id_DOI: str,
        /**
         * Ascession number used by PubMed to categorize a specific
         * bibliographic entry.
         */
        pdbx_database_id_PubMed: int,
    },
    /**
     * Data items in the CITATION_AUTHOR category record details
     * about the authors associated with the citations in the
     * CITATION list.
     */
    citation_author: {
        /**
         * This data item is a pointer to _citation.id in the CITATION
         * category.
         */
        citation_id: str,
        /**
         * Name of an author of the citation; relevant for journal
         * articles, books and book chapters.
         *
         * The family name(s), followed by a comma and including any
         * dynastic components, precedes the first name(s) or initial(s).
         */
        name: str,
        /**
         * This data item defines the order of the author's name in the
         * list of authors of a citation.
         */
        ordinal: int,
    },
    /**
     * Data items in the DATABASE_2 category record details about the
     * database identifiers of the data block.
     *
     * These data items are assigned by database managers and should
     * only appear in a data block if they originate from that source.
     *
     * The name of this category, DATABASE_2, arose because the
     * category name DATABASE was already in use in the core CIF
     * dictionary, but was used differently from the way it needed
     * to be used in the mmCIF dictionary. Since CIF data names
     * cannot be changed once they have been adopted, a new category
     * had to be created.
     */
    database_2: {
        /**
         * An abbreviation that identifies the database.
         */
        database_id: Aliased<'CAS' | 'CSD' | 'EMDB' | 'ICSD' | 'MDF' | 'NDB' | 'NBS' | 'PDB' | 'PDF' | 'RCSB' | 'EBI' | 'PDBE' | 'BMRB' | 'WWPDB' | 'PDB_ACC'>(str),
        /**
         * The code assigned by the database identified in
         * _database_2.database_id.
         */
        database_code: str,
    },
    /**
     * Data items in the ENTITY category record details (such as
     * chemical composition, name and source) about the molecular
     * entities that are present in the crystallographic structure.
     *
     * Items in the various ENTITY subcategories provide a full
     * chemical description of these molecular entities.
     *
     * Entities are of three types:  polymer, non-polymer and water.
     * Note that the water category includes only water;  ordered
     * solvent such as sulfate ion or acetone would be described as
     * individual non-polymer entities.
     *
     * The ENTITY category is specific to macromolecular CIF
     * applications and replaces the function of the CHEMICAL category
     * in the CIF core.
     *
     * It is important to remember that the ENTITY data are not the
     * result of the crystallographic experiment;  those results are
     * represented by the ATOM_SITE data items. ENTITY data items
     * describe the chemistry of the molecules under investigation
     * and can most usefully be thought of as the ideal groups to which
     * the structure is restrained or constrained during refinement.
     *
     * It is also important to remember that entities do not correspond
     * directly to the enumeration of the contents of the asymmetric
     * unit. Entities are described only once, even in those structures
     * that contain multiple observations of an entity. The
     * STRUCT_ASYM data items, which reference the entity list,
     * describe and label the contents of the asymmetric unit.
     */
    entity: {
        /**
         * A description of special aspects of the entity.
         */
        details: str,
        /**
         * Formula mass in daltons of the entity.
         */
        formula_weight: float,
        /**
         * The value of _entity.id must uniquely identify a record in the
         * ENTITY list.
         *
         * Note that this item need not be a number; it can be any unique
         * identifier.
         */
        id: str,
        /**
         * The method by which the sample for the entity was produced.
         * Entities isolated directly from natural sources (tissues, soil
         * samples etc.) are expected to have further information in the
         * ENTITY_SRC_NAT category. Entities isolated from genetically
         * manipulated sources are expected to have further information in
         * the ENTITY_SRC_GEN category.
         */
        src_method: Aliased<'nat' | 'man' | 'syn'>(str),
        /**
         * Defines the type of the entity.
         *
         * Polymer entities are expected to have corresponding
         * ENTITY_POLY and associated entries.
         *
         * Non-polymer entities are expected to have corresponding
         * CHEM_COMP and associated entries.
         *
         * Water entities are not expected to have corresponding
         * entries in the ENTITY category.
         */
        type: Aliased<'polymer' | 'non-polymer' | 'macrolide' | 'water' | 'branched'>(str),
        /**
         * A description of the entity.
         *
         * Corresponds to the compound name in the PDB format.
         */
        pdbx_description: List(',', x => x),
        /**
         * A place holder for the number of molecules of the entity in
         * the entry.
         */
        pdbx_number_of_molecules: int,
        /**
         * Details about any entity mutation(s).
         */
        pdbx_mutation: str,
        /**
         * Entity fragment description(s).
         */
        pdbx_fragment: str,
        /**
         * Enzyme Commission (EC) number(s)
         */
        pdbx_ec: List(',', x => x),
    },
    /**
     * Data items in the ENTITY_POLY category record details about the
     * polymer, such as the type of the polymer, the number of
     * monomers and whether it has nonstandard features.
     */
    entity_poly: {
        /**
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * A flag to indicate whether the polymer contains at least
         * one monomer-to-monomer link different from that implied by
         * _entity_poly.type.
         */
        nstd_linkage: Aliased<'no' | 'n' | 'yes' | 'y'>(str),
        /**
         * A flag to indicate whether the polymer contains at least
         * one monomer that is not considered standard.
         */
        nstd_monomer: Aliased<'no' | 'n' | 'yes' | 'y'>(str),
        /**
         * The type of the polymer.
         */
        type: Aliased<'polypeptide(D)' | 'polypeptide(L)' | 'polydeoxyribonucleotide' | 'polyribonucleotide' | 'polydeoxyribonucleotide/polyribonucleotide hybrid' | 'cyclic-pseudo-peptide' | 'peptide nucleic acid' | 'other'>(str),
        /**
         * The PDB strand/chain id(s) corresponding to this polymer entity.
         */
        pdbx_strand_id: List(',', x => x),
        /**
         * Chemical sequence expressed as string of one-letter
         * amino acid codes. Modifications and non-standard
         * amino acids are coded as X.
         */
        pdbx_seq_one_letter_code: str,
        /**
         * Cannonical chemical sequence expressed as string of
         * one-letter amino acid codes. Modifications are coded
         * as the parent amino acid where possible.
         *
         * A  for alanine or adenine
         * B  for ambiguous asparagine/aspartic-acid
         * R  for arginine
         * N  for asparagine
         * D  for aspartic-acid
         * C  for cysteine or cystine or cytosine
         * Q  for glutamine
         * E  for glutamic-acid
         * Z  for ambiguous glutamine/glutamic acid
         * G  for glycine or guanine
         * H  for histidine
         * I  for isoleucine
         * L  for leucine
         * K  for lysine
         * M  for methionine
         * F  for phenylalanine
         * P  for proline
         * S  for serine
         * T  for threonine or thymine
         * W  for tryptophan
         * Y  for tyrosine
         * V  for valine
         * U  for uracil
         */
        pdbx_seq_one_letter_code_can: str,
        /**
         * For Structural Genomics entries, the sequence's target identifier registered at the TargetTrack database.
         */
        pdbx_target_identifier: str,
    },
    /**
     * Data items in the ENTITY_POLY_SEQ category specify the sequence
     * of monomers in a polymer. Allowance is made for the possibility
     * of microheterogeneity in a sample by allowing a given sequence
     * number to be correlated with more than one monomer ID. The
     * corresponding ATOM_SITE entries should reflect this
     * heterogeneity.
     */
    entity_poly_seq: {
        /**
         * This data item is a pointer to _entity_poly.entity_id in the
         * ENTITY_POLY category.
         */
        entity_id: str,
        /**
         * A flag to indicate whether this monomer in the polymer is
         * heterogeneous in sequence.
         */
        hetero: Aliased<'no' | 'n' | 'yes' | 'y'>(str),
        /**
         * This data item is a pointer to _chem_comp.id in the CHEM_COMP
         * category.
         */
        mon_id: str,
        /**
         * The value of _entity_poly_seq.num must uniquely and sequentially
         * identify a record in the ENTITY_POLY_SEQ list.
         *
         * Note that this item must be a number and that the sequence
         * numbers must progress in increasing numerical order.
         */
        num: int,
    },
    /**
     * There is only one item in the ENTRY category, _entry.id. This
     * data item gives a name to this entry and is indirectly a key to
     * the categories (such as CELL, GEOM, EXPTL) that describe
     * information pertinent to the entire data block.
     */
    entry: {
        /**
         * The value of _entry.id identifies the data block.
         *
         * Note that this item need not be a number; it can be any unique
         * identifier.
         */
        id: str,
    },
    /**
     * Data items in the EXPTL category record details about the
     * experimental work prior to the intensity measurements and
     * details about the absorption-correction technique employed.
     */
    exptl: {
        /**
         * This data item is a pointer to _entry.id in the ENTRY category.
         */
        entry_id: str,
        /**
         * The method used in the experiment.
         */
        method: Aliased<'X-RAY DIFFRACTION' | 'NEUTRON DIFFRACTION' | 'FIBER DIFFRACTION' | 'ELECTRON CRYSTALLOGRAPHY' | 'ELECTRON MICROSCOPY' | 'SOLUTION NMR' | 'SOLID-STATE NMR' | 'SOLUTION SCATTERING' | 'POWDER DIFFRACTION' | 'INFRARED SPECTROSCOPY' | 'EPR' | 'FLUORESCENCE TRANSFER' | 'THEORETICAL MODEL'>(str),
    },
    /**
     * Data items in the STRUCT category record details about the
     * description of the crystallographic structure.
     */
    struct: {
        /**
         * This data item is a pointer to _entry.id in the ENTRY category.
         */
        entry_id: str,
        /**
         * A title for the data block. The author should attempt to convey
         * the essence of the structure archived in the CIF in the title,
         * and to distinguish this structural result from others.
         */
        title: str,
        /**
         * An automatically generated descriptor for an NDB structure or
         * the unstructured content of the PDB COMPND record.
         */
        pdbx_descriptor: str,
    },
    /**
     * Data items in the STRUCT_ASYM category record details about the
     * structural elements in the asymmetric unit.
     */
    struct_asym: {
        /**
         * A description of special aspects of this portion of the contents
         * of the asymmetric unit.
         */
        details: str,
        /**
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * The value of _struct_asym.id must uniquely identify a record in
         * the STRUCT_ASYM list.
         *
         * Note that this item need not be a number; it can be any unique
         * identifier.
         */
        id: str,
        /**
         * This data item indicates whether the structural elements are modified.
         */
        pdbx_modified: str,
        /**
         * A flag indicating that this entity was originally labeled
         * with a blank PDB chain id.
         */
        pdbx_blank_PDB_chainid_flag: Aliased<'Y' | 'N'>(str),
    },
    /**
     * Data items in the STRUCT_CONF category record details about
     * the backbone conformation of a segment of polymer.
     *
     * Data items in the STRUCT_CONF_TYPE category define the
     * criteria used to identify the backbone conformations.
     */
    struct_conf: {
        /**
         * A component of the identifier for the residue at which the
         * conformation segment begins.
         *
         * This data item is a pointer to _atom_site.label_asym_id in the
         * ATOM_SITE category.
         */
        beg_label_asym_id: str,
        /**
         * A component of the identifier for the residue at which the
         * conformation segment begins.
         *
         * This data item is a pointer to _atom_site.label_comp_id in
         * the ATOM_SITE category.
         */
        beg_label_comp_id: str,
        /**
         * A component of the identifier for the residue at which the
         * conformation segment begins.
         *
         * This data item is a pointer to _atom_site.label_seq_id in the
         * ATOM_SITE category.
         */
        beg_label_seq_id: int,
        /**
         * A component of the identifier for the residue at which the
         * conformation segment begins.
         *
         * This data item is a pointer to _atom_site.auth_asym_id in the
         * ATOM_SITE category.
         */
        beg_auth_asym_id: str,
        /**
         * A component of the identifier for the residue at which the
         * conformation segment begins.
         *
         * This data item is a pointer to _atom_site.auth_comp_id in
         * the ATOM_SITE category.
         */
        beg_auth_comp_id: str,
        /**
         * A component of the identifier for the residue at which the
         * conformation segment begins.
         *
         * This data item is a pointer to _atom_site.auth_seq_id in the
         * ATOM_SITE category.
         */
        beg_auth_seq_id: int,
        /**
         * This data item is a pointer to _struct_conf_type.id in the
         * STRUCT_CONF_TYPE category.
         */
        conf_type_id: Aliased<'HELX_P' | 'HELX_OT_P' | 'HELX_RH_P' | 'HELX_RH_OT_P' | 'HELX_RH_AL_P' | 'HELX_RH_GA_P' | 'HELX_RH_OM_P' | 'HELX_RH_PI_P' | 'HELX_RH_27_P' | 'HELX_RH_3T_P' | 'HELX_RH_PP_P' | 'HELX_LH_P' | 'HELX_LH_OT_P' | 'HELX_LH_AL_P' | 'HELX_LH_GA_P' | 'HELX_LH_OM_P' | 'HELX_LH_PI_P' | 'HELX_LH_27_P' | 'HELX_LH_3T_P' | 'HELX_LH_PP_P' | 'HELX_N' | 'HELX_OT_N' | 'HELX_RH_N' | 'HELX_RH_OT_N' | 'HELX_RH_A_N' | 'HELX_RH_B_N' | 'HELX_RH_Z_N' | 'HELX_LH_N' | 'HELX_LH_OT_N' | 'HELX_LH_A_N' | 'HELX_LH_B_N' | 'HELX_LH_Z_N' | 'TURN_P' | 'TURN_OT_P' | 'TURN_TY1_P' | 'TURN_TY1P_P' | 'TURN_TY2_P' | 'TURN_TY2P_P' | 'TURN_TY3_P' | 'TURN_TY3P_P' | 'STRN'>(str),
        /**
         * A description of special aspects of the conformation assignment.
         */
        details: str,
        /**
         * A component of the identifier for the residue at which the
         * conformation segment ends.
         *
         * This data item is a pointer to _atom_site.label_asym_id in the
         * ATOM_SITE category.
         */
        end_label_asym_id: str,
        /**
         * A component of the identifier for the residue at which the
         * conformation segment ends.
         *
         * This data item is a pointer to _atom_site.label_comp_id in the
         * ATOM_SITE category.
         */
        end_label_comp_id: str,
        /**
         * A component of the identifier for the residue at which the
         * conformation segment ends.
         *
         * This data item is a pointer to _atom_site.label_seq_id in the
         * ATOM_SITE category.
         */
        end_label_seq_id: int,
        /**
         * A component of the identifier for the residue at which the
         * conformation segment ends.
         *
         * This data item is a pointer to _atom_site.auth_asym_id in the
         * ATOM_SITE category.
         */
        end_auth_asym_id: str,
        /**
         * A component of the identifier for the residue at which the
         * conformation segment ends.
         *
         * This data item is a pointer to _atom_site.auth_comp_id in the
         * ATOM_SITE category.
         */
        end_auth_comp_id: str,
        /**
         * A component of the identifier for the residue at which the
         * conformation segment ends.
         *
         * This data item is a pointer to _atom_site.auth_seq_id in the
         * ATOM_SITE category.
         */
        end_auth_seq_id: int,
        /**
         * The value of _struct_conf.id must uniquely identify a record in
         * the STRUCT_CONF list.
         *
         * Note that this item need not be a number; it can be any unique
         * identifier.
         */
        id: str,
        /**
         * A component of the identifier for the residue at which the
         * conformation segment starts.
         */
        pdbx_beg_PDB_ins_code: str,
        /**
         * A component of the identifier for the residue at which the
         * conformation segment ends.
         */
        pdbx_end_PDB_ins_code: str,
        /**
         * This item is a place holder for the helix class used in the PDB
         * HELIX record.
         */
        pdbx_PDB_helix_class: str,
        /**
         * A placeholder for the lengths of the helix of the PDB
         * HELIX record.
         */
        pdbx_PDB_helix_length: int,
        /**
         * A placeholder for the helix identifier of the PDB
         * HELIX record.
         */
        pdbx_PDB_helix_id: str,
    },
    /**
     * Data items in the STRUCT_CONN category record details about
     * the connections between portions of the structure. These can be
     * hydrogen bonds, salt bridges, disulfide bridges and so on.
     *
     * The STRUCT_CONN_TYPE records define the criteria used to
     * identify these connections.
     */
    struct_conn: {
        /**
         * This data item is a pointer to _struct_conn_type.id in the
         * STRUCT_CONN_TYPE category.
         */
        conn_type_id: Aliased<'covale' | 'disulf' | 'metalc' | 'hydrog'>(str),
        /**
         * A description of special aspects of the connection.
         */
        details: str,
        /**
         * The value of _struct_conn.id must uniquely identify a record in
         * the STRUCT_CONN list.
         *
         * Note that this item need not be a number; it can be any unique
         * identifier.
         */
        id: str,
        /**
         * A component of the identifier for partner 1 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.label_asym_id in the
         * ATOM_SITE category.
         */
        ptnr1_label_asym_id: str,
        /**
         * A component of the identifier for partner 1 of the structure
         * connection.
         *
         * This data item is a pointer to _chem_comp_atom.atom_id in the
         * CHEM_COMP_ATOM category.
         */
        ptnr1_label_atom_id: str,
        /**
         * A component of the identifier for partner 1 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.label_comp_id in the
         * ATOM_SITE category.
         */
        ptnr1_label_comp_id: str,
        /**
         * A component of the identifier for partner 1 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.label_seq_id in the
         * ATOM_SITE category.
         */
        ptnr1_label_seq_id: int,
        /**
         * A component of the identifier for partner 1 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.auth_asym_id in the
         * ATOM_SITE category.
         */
        ptnr1_auth_asym_id: str,
        /**
         * A component of the identifier for partner 1 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.auth_comp_id in the
         * ATOM_SITE category.
         */
        ptnr1_auth_comp_id: str,
        /**
         * A component of the identifier for partner 1 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.auth_seq_id in the
         * ATOM_SITE category.
         */
        ptnr1_auth_seq_id: str,
        /**
         * Describes the symmetry operation that should be applied to the
         * atom set specified by _struct_conn.ptnr1_label* to generate the
         * first partner in the structure connection.
         */
        ptnr1_symmetry: str,
        /**
         * A component of the identifier for partner 2 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.label_asym_id in the
         * ATOM_SITE category.
         */
        ptnr2_label_asym_id: str,
        /**
         * A component of the identifier for partner 2 of the structure
         * connection.
         *
         * This data item is a pointer to _chem_comp_atom.atom_id in the
         * CHEM_COMP_ATOM category.
         */
        ptnr2_label_atom_id: str,
        /**
         * A component of the identifier for partner 2 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.label_comp_id in the
         * ATOM_SITE category.
         */
        ptnr2_label_comp_id: str,
        /**
         * A component of the identifier for partner 2 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.label_seq_id in the
         * ATOM_SITE category.
         */
        ptnr2_label_seq_id: int,
        /**
         * A component of the identifier for partner 2 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.auth_asym_id in the
         * ATOM_SITE category.
         */
        ptnr2_auth_asym_id: str,
        /**
         * A component of the identifier for partner 2 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.auth_comp_id in the
         * ATOM_SITE category.
         */
        ptnr2_auth_comp_id: str,
        /**
         * A component of the identifier for partner 2 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.auth_seq_id in the
         * ATOM_SITE category.
         */
        ptnr2_auth_seq_id: str,
        /**
         * Describes the symmetry operation that should be applied to the
         * atom set specified by _struct_conn.ptnr2_label* to generate the
         * second partner in the structure connection.
         */
        ptnr2_symmetry: str,
        /**
         * A component of the identifier for partner 1 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.pdbx_PDB_ins_code in the
         * ATOM_SITE category.
         */
        pdbx_ptnr1_PDB_ins_code: str,
        /**
         * A component of the identifier for partner 1 of the
         * structure connection. This data item is a pointer to
         * _atom_site.label_alt_id in the ATOM_SITE category.
         */
        pdbx_ptnr1_label_alt_id: str,
        /**
         * A placeholder for the standard residue name found in
         * the MODRES record of a PDB file.
         */
        pdbx_ptnr1_standard_comp_id: str,
        /**
         * A component of the identifier for partner 1 of the structure
         * connection.
         *
         * This data item is a pointer to _atom_site.pdbx_PDB_ins_code in the
         * ATOM_SITE category.
         */
        pdbx_ptnr2_PDB_ins_code: str,
        /**
         * A component of the identifier for partner 2 of the
         * structure connection. This data item is a pointer to
         * _atom_site.label_alt_id in the ATOM_SITE category.
         */
        pdbx_ptnr2_label_alt_id: str,
        /**
         * A component of the identifier for partner 3 of the
         * structure connection. This data item is a pointer to
         * _atom_site.pdbx_PDB_ins_code in the ATOM_SITE category.
         */
        pdbx_ptnr3_PDB_ins_code: str,
        /**
         * A component of the identifier for partner 3 of the
         * structure connection. This data item is a pointer to
         * _atom_site.label_alt_id in the ATOM_SITE category.
         */
        pdbx_ptnr3_label_alt_id: str,
        /**
         * A component of the identifier for partner 3 of the
         * structure connection. This data item is a pointer to
         * _atom_site.label_asym_id in the ATOM_SITE category.
         */
        pdbx_ptnr3_label_asym_id: str,
        /**
         * A component of the identifier for partner 3 of the
         * structure connection. This data item is a pointer to
         * _atom_site.label_atom_id in the ATOM_SITE category.
         */
        pdbx_ptnr3_label_atom_id: str,
        /**
         * A component of the identifier for partner 3 of the
         * structure connection. This data item is a pointer to
         * _atom_site.label_comp_id in the ATOM_SITE category.
         */
        pdbx_ptnr3_label_comp_id: str,
        /**
         * A component of the identifier for partner 1 of the
         * structure connection. This data item is a pointer to
         * _atom_site.label_seq_id in the ATOM_SITE category.
         */
        pdbx_ptnr3_label_seq_id: int,
        /**
         * A placeholder for the PDB id in the case the category
         * is used to hold the information of the MODRES record of
         * a PDB file.
         */
        pdbx_PDB_id: str,
        /**
         * Distance value for this contact.
         */
        pdbx_dist_value: float,
        /**
         * The chemical bond order associated with the specified atoms in
         * this contact.
         */
        pdbx_value_order: Aliased<'sing' | 'doub' | 'trip' | 'quad'>(str),
    },
    /**
     * Data items in the STRUCT_CONN_TYPE category record details
     * about the criteria used to identify interactions between
     * portions of the structure.
     */
    struct_conn_type: {
        /**
         * The criteria used to define the interaction.
         */
        criteria: str,
        /**
         * The chemical or structural type of the interaction.
         */
        id: Aliased<'covale' | 'disulf' | 'hydrog' | 'metalc' | 'mismat' | 'saltbr' | 'modres' | 'covale_base' | 'covale_sugar' | 'covale_phosphate'>(str),
        /**
         * A reference that specifies the criteria used to define the
         * interaction.
         */
        reference: str,
    },
    /**
     * Data items in the STRUCT_KEYWORDS category specify keywords
     * that describe the chemical structure in this entry.
     */
    struct_keywords: {
        /**
         * This data item is a pointer to _entry.id in the ENTRY category.
         */
        entry_id: str,
        /**
         * Keywords describing this structure.
         */
        text: List(',', x => x),
        /**
         * Terms characterizing the macromolecular structure.
         */
        pdbx_keywords: str,
    },
    /**
     * Data items in the STRUCT_NCS_OPER category describe the
     * noncrystallographic symmetry operations.
     *
     * Each operator is specified as a matrix and a subsequent
     * translation vector. Operators need not represent proper
     * rotations.
     */
    struct_ncs_oper: {
        /**
         * A code to indicate whether this operator describes a
         * relationship between coordinates all of which are given in the
         * data block (in which case the value of code is 'given'), or
         * whether the operator is used to generate new coordinates from
         * those that are given in the data block (in which case the value
         * of code is 'generate').
         */
        code: Aliased<'given' | 'generate'>(str),
        /**
         * A description of special aspects of the noncrystallographic
         * symmetry operator.
         */
        details: str,
        /**
         * The value of _struct_ncs_oper.id must uniquely identify a
         * record in the STRUCT_NCS_OPER list.
         *
         * Note that for PDB _struct_ncs_oper.id must be a number.
         */
        id: int,
        /**
         * The elements of the 3x3 matrix component of a
         * noncrystallographic symmetry operation.
         */
        matrix: Matrix(3, 3),
        /**
         * The elements of the three-element vector component of a
         * noncrystallographic symmetry operation.
         */
        vector: Vector(3),
    },
    /**
     * Data items in the STRUCT_SHEET_RANGE category record details
     * about the residue ranges that form a beta-sheet. Residues are
     * included in a range if they made beta-sheet-type hydrogen-bonding
     * interactions with at least one adjacent strand and if there are
     * at least two residues in the range.
     */
    struct_sheet_range: {
        /**
         * A component of the identifier for the residue at which the
         * beta-sheet range begins.
         *
         * This data item is a pointer to _struct_asym.id in the
         * STRUCT_ASYM category.
         */
        beg_label_asym_id: str,
        /**
         * A component of the identifier for the residue at which the
         * beta-sheet range begins.
         *
         * This data item is a pointer to _chem_comp.id in the CHEM_COMP
         * category.
         */
        beg_label_comp_id: str,
        /**
         * A component of the identifier for the residue at which the
         * beta-sheet range begins.
         *
         * This data item is a pointer to _atom_site.label_seq_id in the
         * ATOM_SITE category.
         */
        beg_label_seq_id: int,
        /**
         * A component of the identifier for the residue at which the
         * beta-sheet range ends.
         *
         * This data item is a pointer to _struct_asym.id in the
         * STRUCT_ASYM category.
         */
        end_label_asym_id: str,
        /**
         * A component of the identifier for the residue at which the
         * beta-sheet range ends.
         *
         * This data item is a pointer to _chem_comp.id in the CHEM_COMP
         * category.
         */
        end_label_comp_id: str,
        /**
         * A component of the identifier for the residue at which the
         * beta-sheet range ends.
         *
         * This data item is a pointer to _atom_site.label_seq_id in the
         * ATOM_SITE category.
         */
        end_label_seq_id: int,
        /**
         * A component of the identifier for the residue at which the
         * beta-sheet range begins.
         *
         * This data item is a pointer to _atom_site.auth_asym_id in the
         * ATOM_SITE category.
         */
        beg_auth_asym_id: str,
        /**
         * A component of the identifier for the residue at which the
         * beta-sheet range begins.
         *
         * This data item is a pointer to _atom_site.auth_comp_id in
         * the ATOM_SITE category.
         */
        beg_auth_comp_id: str,
        /**
         * A component of the identifier for the residue at which the
         * beta-sheet range begins.
         *
         * This data item is a pointer to _atom_site.auth_seq_id in the
         * ATOM_SITE category.
         */
        beg_auth_seq_id: int,
        /**
         * A component of the identifier for the residue at which the
         * beta-sheet range ends.
         *
         * This data item is a pointer to _atom_site.auth_asym_id in the
         * ATOM_SITE category.
         */
        end_auth_asym_id: str,
        /**
         * A component of the identifier for the residue at which the
         * beta-sheet range ends.
         *
         * This data item is a pointer to _atom_site.auth_comp_id in the
         * ATOM_SITE category.
         */
        end_auth_comp_id: str,
        /**
         * A component of the identifier for the residue at which the
         * beta-sheet range ends.
         *
         * This data item is a pointer to _atom_site.auth_seq_id in the
         * ATOM_SITE category.
         */
        end_auth_seq_id: int,
        /**
         * The value of _struct_sheet_range.id must uniquely identify a
         * range in a given sheet in the STRUCT_SHEET_RANGE list.
         *
         * Note that this item need not be a number; it can be any unique
         * identifier.
         */
        id: str,
        /**
         * This data item is a pointer to _struct_sheet.id in the
         * STRUCT_SHEET category.
         */
        sheet_id: str,
        /**
         * A component of the identifier for the residue at which the
         * beta sheet range begins.  Insertion code.
         */
        pdbx_beg_PDB_ins_code: str,
        /**
         * A component of the identifier for the residue at which the
         * beta sheet range ends. Insertion code.
         */
        pdbx_end_PDB_ins_code: str,
    },
    /**
     * Data items in the STRUCT_SITE category record details about
     * portions of the structure that contribute to structurally
     * relevant sites (e.g. active sites, substrate-binding subsites,
     * metal-coordination sites).
     */
    struct_site: {
        /**
         * A description of special aspects of the site.
         */
        details: str,
        /**
         * The value of _struct_site.id must uniquely identify a record in
         * the STRUCT_SITE list.
         *
         * Note that this item need not be a number; it can be any unique
         * identifier.
         */
        id: str,
        /**
         * Number of residues in the site.
         */
        pdbx_num_residues: int,
        /**
         * Source of evidence supporting the assignment of this site.
         */
        pdbx_evidence_code: str,
        /**
         * A component of the identifier for the ligand in the site.
         *
         * This data item is a pointer to _atom_site.auth_asym_id in the
         * ATOM_SITE category.
         */
        pdbx_auth_asym_id: str,
        /**
         * A component of the identifier for the ligand in the site.
         *
         * This data item is a pointer to _atom_site.auth_comp_id in the
         * ATOM_SITE category.
         */
        pdbx_auth_comp_id: str,
        /**
         * A component of the identifier for the ligand in the site.
         *
         * This data item is a pointer to _atom_site.auth_seq_id in the
         * ATOM_SITE category.
         */
        pdbx_auth_seq_id: str,
        /**
         * PDB insertion code for the ligand in the site.
         */
        pdbx_auth_ins_code: str,
    },
    /**
     * Data items in the STRUCT_SITE_GEN category record details about
     * the generation of portions of the structure that contribute to
     * structurally relevant sites.
     */
    struct_site_gen: {
        /**
         * A description of special aspects of the symmetry generation of
         * this portion of the structural site.
         */
        details: str,
        /**
         * The value of _struct_site_gen.id must uniquely identify a record
         * in the STRUCT_SITE_GEN list.
         *
         * Note that this item need not be a number; it can be any unique
         * identifier.
         */
        id: str,
        /**
         * A component of the identifier for participants in the site.
         *
         * This data item is a pointer to _atom_sites_alt.id in the
         * ATOM_SITES_ALT category.
         */
        label_alt_id: str,
        /**
         * A component of the identifier for participants in the site.
         *
         * This data item is a pointer to _atom_site.label_asym_id in the
         * ATOM_SITE category.
         */
        label_asym_id: str,
        /**
         * A component of the identifier for participants in the site.
         *
         * This data item is a pointer to _chem_comp_atom.atom_id in the
         * CHEM_COMP_ATOM category.
         */
        label_atom_id: str,
        /**
         * A component of the identifier for participants in the site.
         *
         * This data item is a pointer to _atom_site.label_comp_id in the
         * ATOM_SITE category.
         */
        label_comp_id: str,
        /**
         * A component of the identifier for participants in the site.
         *
         * This data item is a pointer to _atom_site.label_seq_id in the
         * ATOM_SITE category.
         */
        label_seq_id: int,
        /**
         * A component of the identifier for participants in the site.
         *
         * This data item is a pointer to _atom_site.auth_asym_id in the
         * ATOM_SITE category.
         */
        auth_asym_id: str,
        /**
         * A component of the identifier for participants in the site.
         *
         * This data item is a pointer to _atom_site.auth_comp_id in the
         * ATOM_SITE category.
         */
        auth_comp_id: str,
        /**
         * A component of the identifier for participants in the site.
         *
         * This data item is a pointer to _atom_site.auth_seq_id in the
         * ATOM_SITE category.
         */
        auth_seq_id: str,
        /**
         * This data item is a pointer to _struct_site.id in the STRUCT_SITE
         * category.
         */
        site_id: str,
        /**
         * Describes the symmetry operation that should be applied to the
         * atom set specified by _struct_site_gen.label* to generate a
         * portion of the site.
         */
        symmetry: str,
        /**
         * PDB insertion code.
         */
        pdbx_auth_ins_code: str,
        /**
         * Number of residues in the site.
         */
        pdbx_num_res: int,
    },
    /**
     * Data items in the SYMMETRY category record details about the
     * space-group symmetry.
     */
    symmetry: {
        /**
         * This data item is a pointer to _entry.id in the ENTRY category.
         */
        entry_id: str,
        /**
         * The cell settings for this space-group symmetry.
         */
        cell_setting: Aliased<'triclinic' | 'monoclinic' | 'orthorhombic' | 'tetragonal' | 'rhombohedral' | 'trigonal' | 'hexagonal' | 'cubic'>(str),
        /**
         * Space-group number from International Tables for Crystallography
         * Vol. A (2002).
         */
        Int_Tables_number: int,
        /**
         * Space-group symbol as described by Hall (1981). This symbol
         * gives the space-group setting explicitly. Leave spaces between
         * the separate components of the symbol.
         *
         * Ref: Hall, S. R. (1981). Acta Cryst. A37, 517-525; erratum
         * (1981) A37, 921.
         */
        space_group_name_Hall: str,
        /**
         * Hermann-Mauguin space-group symbol. Note that the
         * Hermann-Mauguin symbol does not necessarily contain complete
         * information about the symmetry and the space-group origin. If
         * used, always supply the FULL symbol from International Tables
         * for Crystallography Vol. A (2002) and indicate the origin and
         * the setting if it is not implicit. If there is any doubt that
         * the equivalent positions can be uniquely deduced from this
         * symbol, specify the  _symmetry_equiv.pos_as_xyz or
         * _symmetry.space_group_name_Hall  data items as well. Leave
         * spaces between symbols referring to
         * different axes.
         */
        'space_group_name_H-M': str,
    },
    /**
     * These are internal RCSB records to keep track of data processing
     * and status of the entry.
     */
    pdbx_database_status: {
        /**
         * Code for status of file.
         */
        status_code: Aliased<'PROC' | 'WAIT' | 'REL' | 'HOLD' | 'HPUB' | 'REFI' | 'OBS' | 'WDRN' | 'AUTH' | 'POLC' | 'REPL' | 'AUCO' | 'TRSF' | 'RMVD' | 'DEL' | 'REV' | 'UPD' | 'BIB'>(str),
        /**
         * Code for status of structure factor file.
         */
        status_code_sf: Aliased<'PROC' | 'WAIT' | 'REL' | 'HOLD' | 'HPUB' | 'OBS' | 'WDRN' | 'AUTH' | 'POLC' | 'REPL' | 'RMVD'>(str),
        /**
         * Code for status of NMR constraints file.
         */
        status_code_mr: Aliased<'PROC' | 'WAIT' | 'REL' | 'HOLD' | 'HPUB' | 'OBS' | 'WDRN' | 'AUTH' | 'POLC' | 'REPL' | 'RMVD'>(str),
        /**
         * The value of _pdbx_database_status.entry_id identifies the data block.
         */
        entry_id: str,
        /**
         * The date of initial deposition.  (The first message for
         * deposition has been received.)
         */
        recvd_initial_deposition_date: str,
        /**
         * This code indicates whether the entry belongs to
         * Structural Genomics Project.
         */
        SG_entry: Aliased<'Y' | 'N'>(str),
        /**
         * The site where the file was deposited.
         */
        deposit_site: Aliased<'NDB' | 'RCSB' | 'PDBE' | 'PDBJ' | 'BMRB' | 'BNL' | 'PDBC'>(str),
        /**
         * The site where the file was deposited.
         */
        process_site: Aliased<'NDB' | 'RCSB' | 'PDBE' | 'PDBJ' | 'BNL' | 'PDBC'>(str),
        /**
         * Code for status of chemical shift data file.
         */
        status_code_cs: Aliased<'PROC' | 'WAIT' | 'AUTH' | 'POLC' | 'REPL' | 'REL' | 'HOLD' | 'HPUB' | 'OBS' | 'RMVD' | 'WDRN'>(str),
        /**
         * The methods development category in which this
         * entry has been placed.
         */
        methods_development_category: Aliased<'CAPRI' | 'CASP' | 'CASD-NMR' | 'FoldIt' | 'GPCR Dock' | 'D3R' | 'RNA-Puzzles'>(str),
        /**
         * A flag indicating that the entry is compatible with the PDB format.
         *
         * A value of 'N' indicates that the no PDB format data file is
         * corresponding to this entry is available in the PDB archive.
         */
        pdb_format_compatible: Aliased<'Y' | 'N'>(str),
    },
    /**
     * The PDBX_NONPOLY_SCHEME category provides residue level nomenclature
     * mapping for non-polymer entities.
     */
    pdbx_nonpoly_scheme: {
        /**
         * Pointer to _atom_site.label_asym_id.
         */
        asym_id: str,
        /**
         * Pointer to _atom_site.label_entity_id.
         */
        entity_id: str,
        /**
         * Pointer to _atom_site.label_comp_id.
         */
        mon_id: str,
        /**
         * PDB strand/chain id.
         */
        pdb_strand_id: str,
        /**
         * NDB/RCSB residue number.
         */
        ndb_seq_num: str,
        /**
         * PDB residue number.
         */
        pdb_seq_num: str,
        /**
         * Author provided residue numbering.   This value may differ from the PDB residue
         * number and may not correspond to residue numbering within the coordinate records.
         */
        auth_seq_num: str,
        /**
         * PDB residue identifier.
         */
        pdb_mon_id: str,
        /**
         * Author provided residue identifier.   This value may differ from the PDB residue
         * identifier and may not correspond to residue identification within the coordinate records.
         */
        auth_mon_id: str,
        /**
         * PDB insertion code.
         */
        pdb_ins_code: str,
    },
    /**
     * Data items in PDBX_DATABASE_RELATED contain references to entries
     * that are related to the this entry.
     */
    pdbx_database_related: {
        /**
         * The name of the database containing the related entry.
         */
        db_name: str,
        /**
         * A description of the related entry.
         */
        details: str,
        /**
         * The identifying code in the related database.
         */
        db_id: str,
        /**
         * The identifying content type of the related entry.
         */
        content_type: Aliased<'minimized average structure' | 'representative structure' | 'ensemble' | 'derivative structure' | 'native structure' | 'associated EM volume' | 'other EM volume' | 'associated NMR restraints' | 'associated structure factors' | 'associated SAS data' | 'protein target sequence and/or protocol data' | 'split' | 're-refinement' | 'complete structure' | 'unspecified' | 'other'>(str),
    },
    pdbx_entity_nonpoly: {
        /**
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * This data item is a pointer to _chem_comp.id in the CHEM_COMP category.
         */
        comp_id: str,
        /**
         * A name for the non-polymer entity
         */
        name: str,
    },
    /**
     * PDBX_CHEM_COMP_SYNONYMS holds chemical name and synonym correspondences.
     */
    pdbx_chem_comp_synonyms: {
        /**
         * The synonym of this particular chemical component.
         */
        name: str,
        /**
         * The chemical component for which this synonym applies.
         */
        comp_id: str,
        /**
         * The provenance of this synonym.
         */
        provenance: Aliased<'AUTHOR' | 'DRUGBANK' | 'CHEBI' | 'CHEMBL' | 'PDB' | 'PUBCHEM'>(str),
    },
    /**
     * Data items in the CHEM_COMP_IDENTIFIER category provide
     * identifiers for chemical components.
     */
    pdbx_chem_comp_identifier: {
        /**
         * This data item is a pointer to _chem_comp.id in the CHEM_COMP
         * category.
         */
        comp_id: str,
        /**
         * This data item contains the identifier value for this
         * component.
         */
        identifier: str,
        /**
         * This data item contains the identifier type.
         */
        type: Aliased<'COMMON NAME' | 'SYSTEMATIC NAME' | 'CAS REGISTRY NUMBER' | 'PUBCHEM Identifier' | 'MDL Identifier' | 'SYNONYM' | 'CONDENSED IUPAC CARB SYMBOL' | 'IUPAC CARB SYMBOL' | 'SNFG CARB SYMBOL' | 'CONDENSED IUPAC CARBOHYDRATE SYMBOL' | 'IUPAC CARBOHYDRATE SYMBOL' | 'SNFG CARBOHYDRATE SYMBOL'>(str),
        /**
         * This data item contains the name of the program
         * or library used to compute the identifier.
         */
        program: str,
        /**
         * This data item contains the version of the program
         * or library used to compute the identifier.
         */
        program_version: str,
    },
    /**
     * Data items in the PDBX_UNOBS_OR_ZERO_OCC_RESIDUES category list the
     * residues within the entry that are not observed or have zero occupancy.
     */
    pdbx_unobs_or_zero_occ_residues: {
        /**
         * The value of _pdbx_unobs_or_zero_occ_residues.id must uniquely identify
         * each item in the PDBX_UNOBS_OR_ZERO_OCC_RESIDUES list.
         *
         * This is an integer serial number.
         */
        id: int,
        /**
         * The value of polymer flag indicates whether the unobserved or
         * zero occupancy residue is part of a polymer chain or not
         */
        polymer_flag: Aliased<'Y' | 'N'>(str),
        /**
         * The value of occupancy flag indicates whether the residue
         * is unobserved (= 1) or the coordinates have an occupancy of zero (=0)
         */
        occupancy_flag: Aliased<'1' | '0'>(int),
        /**
         * Part of the identifier for the unobserved or zero occupancy residue.
         *
         * This data item is a pointer to _atom_site.pdbx_PDB_model_num in the
         * ATOM_SITE category.
         */
        PDB_model_num: int,
        /**
         * Part of the identifier for the unobserved or zero occupancy residue.
         *
         * This data item is a pointer to _atom_site.auth_asym_id in the
         * ATOM_SITE category.
         */
        auth_asym_id: str,
        /**
         * Part of the identifier for the unobserved or zero occupancy residue.
         *
         * This data item is a pointer to _atom_site.auth_comp_id in the
         * ATOM_SITE category.
         */
        auth_comp_id: str,
        /**
         * Part of the identifier for the unobserved or zero occupancy residue.
         *
         * This data item is a pointer to _atom_site.auth_seq_id in the
         * ATOM_SITE category.
         */
        auth_seq_id: str,
        /**
         * Part of the identifier for the unobserved or zero occupancy residue.
         *
         * This data item is a pointer to _atom_site.pdbx_PDB_ins_code in the
         * ATOM_SITE category.
         */
        PDB_ins_code: str,
        /**
         * Part of the identifier for the unobserved or zero occupancy residue.
         *
         * This data item is a pointer to _atom_site.label_asym_id in the
         * ATOM_SITE category.
         */
        label_asym_id: str,
        /**
         * Part of the identifier for the unobserved or zero occupancy residue.
         *
         * This data item is a pointer to _atom_site.label_comp_id in the
         * ATOM_SITE category.
         */
        label_comp_id: str,
        /**
         * Part of the identifier for the unobserved or zero occupancy residue.
         *
         * This data item is a pointer to _atom_site.label_seq_id in the
         * ATOM_SITE category.
         */
        label_seq_id: int,
    },
    /**
     * Data items in the PDBX_STRUCT_MOD_RESIDUE category list the
     * modified polymer components in the entry and provide some
     * details describing the nature of the modification.
     */
    pdbx_struct_mod_residue: {
        /**
         * The value of _pdbx_struct_mod_residue.id must uniquely identify
         * each item in the PDBX_STRUCT_MOD_RESIDUE list.
         *
         * This is an integer serial number.
         */
        id: int,
        /**
         * Part of the identifier for the modified polymer component.
         *
         * This data item is a pointer to _atom_site.auth_asym_id in the
         * ATOM_SITE category.
         */
        auth_asym_id: str,
        /**
         * Part of the identifier for the modified polymer component.
         *
         * This data item is a pointer to _atom_site.auth_comp_id in the
         * ATOM_SITE category.
         */
        auth_comp_id: str,
        /**
         * Part of the identifier for the modified polymer component.
         *
         * This data item is a pointer to _atom_site.auth_seq_id in the
         * ATOM_SITE category.
         */
        auth_seq_id: int,
        /**
         * Part of the identifier for the modified polymer component.
         *
         * This data item is a pointer to _atom_site.pdbx_PDB_ins_code in the
         * ATOM_SITE category.
         */
        PDB_ins_code: str,
        /**
         * Part of the identifier for the modified polymer component.
         *
         * This data item is a pointer to _atom_site.label_asym_id in the
         * ATOM_SITE category.
         */
        label_asym_id: str,
        /**
         * Part of the identifier for the modified polymer component.
         *
         * This data item is a pointer to _atom_site.label_comp_id in the
         * ATOM_SITE category.
         */
        label_comp_id: str,
        /**
         * Part of the identifier for the unobserved or zero occupancy residue.
         *
         * This data item is a pointer to _atom_site.label_seq_id in the
         * ATOM_SITE category.
         */
        label_seq_id: int,
        /**
         * The parent component identifier for this modified polymer component.
         */
        parent_comp_id: str,
        /**
         * Details of the modification for this polymer component.
         */
        details: str,
    },
    /**
     * Data items in the PDBX_STRUCT_OPER_LIST category describe
     * Cartesian rotation and translation operations required to
     * generate or transform the coordinates deposited with this entry.
     */
    pdbx_struct_oper_list: {
        /**
         * This identifier code must uniquely identify a
         * record in the PDBX_STRUCT_OPER_LIST list.
         */
        id: str,
        /**
         * A code to indicate the type of operator.
         */
        type: Aliased<'identity operation' | 'point symmetry operation' | 'helical symmetry operation' | 'crystal symmetry operation' | '3D crystal symmetry operation' | '2D crystal symmetry operation' | 'transform to point frame' | 'transform to helical frame' | 'transform to crystal frame' | 'transform to 2D crystal frame' | 'transform to 3D crystal frame' | 'build point asymmetric unit' | 'build helical asymmetric unit' | 'build 2D crystal asymmetric unit' | 'build 3D crystal asymmetric unit'>(str),
        /**
         * A descriptive name for the transformation operation.
         */
        name: str,
        /**
         * The symmetry operation corresponding to the transformation operation.
         */
        symmetry_operation: str,
        /**
         * The elements of the 3x3 matrix component of the
         * transformation operation.
         */
        matrix: Matrix(3, 3),
        /**
         * The elements of the three-element vector component of the
         * transformation operation.
         */
        vector: Vector(3),
    },
    /**
     * Data items in the PDBX_STRUCT_ASSEMBLY category record details about
     * the structural elements that form macromolecular assemblies.
     */
    pdbx_struct_assembly: {
        /**
         * Provides details of the method used to determine or
         * compute the assembly.
         */
        method_details: str,
        /**
         * Provides the details of the oligomeric state of the assembly.
         */
        oligomeric_details: str,
        /**
         * The number of polymer molecules in the assembly.
         */
        oligomeric_count: int,
        /**
         * A description of special aspects of the macromolecular assembly.
         */
        details: str,
        /**
         * The value of _pdbx_struct_assembly.id must uniquely identify a record in
         * the PDBX_STRUCT_ASSEMBLY list.
         */
        id: str,
    },
    /**
     * Data items in the PDBX_STRUCT_ASSEMBLY_GEN category record details about
     * the generation of each macromolecular assemblies. The PDBX_STRUCT_ASSEMBLY_GEN
     * data items provide the specifications of the components that
     * constitute that assembly in terms of cartesian transformations.
     */
    pdbx_struct_assembly_gen: {
        /**
         * This data item is a pointer to _struct_asym.id in
         * the STRUCT_ASYM category.
         *
         * This item may be expressed as a comma separated list of identifiers.
         */
        asym_id_list: List(',', x => x),
        /**
         * This data item is a pointer to _pdbx_struct_assembly.id in the
         * PDBX_STRUCT_ASSEMBLY category.
         */
        assembly_id: str,
        /**
         * Identifies the operation of collection of operations
         * from category PDBX_STRUCT_OPER_LIST.
         *
         * Operation expressions may have the forms:
         *
         * (1)        the single operation 1
         * (1,2,5)    the operations 1, 2, 5
         * (1-4)      the operations 1,2,3 and 4
         * (1,2)(3,4) the combinations of operations
         * 3 and 4 followed by 1 and 2 (i.e.
         * the cartesian product of parenthetical
         * groups applied from right to left)
         */
        oper_expression: str,
    },
    /**
     * Data items in the PDBX_REFERENCE_ENTITY_LIST category record
     * the list of entities within each reference molecule.
     */
    pdbx_reference_entity_list: {
        /**
         * The value of _pdbx_reference_entity_list.prd_id is a reference
         * _pdbx_reference_molecule.prd_id in the PDBX_REFERENCE_MOLECULE category.
         */
        prd_id: str,
        /**
         * The value of _pdbx_reference_entity_list.ref_entity_id is a unique identifier
         * the a constituent entity within this reference molecule.
         */
        ref_entity_id: str,
        /**
         * Defines the polymer characteristic of the entity.
         */
        type: Aliased<'polymer' | 'polymer-like' | 'non-polymer' | 'branched'>(str),
        /**
         * Additional details about this entity.
         */
        details: str,
        /**
         * The component number of this entity within the molecule.
         */
        component_id: int,
    },
    /**
     * Data items in the PDBX_REFERENCE_ENTITY_LINK category give details about
     * the linkages between entities within reference molecules.
     */
    pdbx_reference_entity_link: {
        /**
         * The value of _pdbx_reference_entity_link.link_id uniquely identifies
         * linkages between entities with a molecule.
         */
        link_id: int,
        /**
         * The value of _pdbx_reference_entity_link.prd_id is a reference
         * _pdbx_reference_entity_list.prd_id in the PDBX_REFERENCE_ENTITY_LIST category.
         */
        prd_id: str,
        /**
         * A description of special aspects of a linkage between
         * chemical components in the structure.
         */
        details: str,
        /**
         * The reference entity id of the first of the two entities joined by the
         * linkage.
         *
         * This data item is a pointer to _pdbx_reference_entity_list.ref_entity_id
         * in the PDBX_REFERENCE_ENTITY_LIST category.
         */
        ref_entity_id_1: str,
        /**
         * The reference entity id of the second of the two entities joined by the
         * linkage.
         *
         * This data item is a pointer to _pdbx_reference_entity_list.ref_entity_id
         * in the PDBX_REFERENCE_ENTITY_LIST category.
         */
        ref_entity_id_2: str,
        /**
         * For a polymer entity, the sequence number in the first of
         * the two entities containing the linkage.
         *
         * This data item is a pointer to _pdbx_reference_entity_poly_seq.num
         * in the PDBX_REFERENCE_ENTITY_POLY_SEQ category.
         */
        entity_seq_num_1: int,
        /**
         * For a polymer entity, the sequence number in the second of
         * the two entities containing the linkage.
         *
         * This data item is a pointer to _pdbx_reference_entity_poly_seq.num
         * in the PDBX_REFERENCE_ENTITY_POLY_SEQ category.
         */
        entity_seq_num_2: int,
        /**
         * The component identifier in the first of the two entities containing the linkage.
         *
         * For polymer entities, this data item is a pointer to _pdbx_reference_entity_poly_seq.mon_id
         * in the PDBX_REFERENCE_ENTITY_POLY_SEQ category.
         *
         * For non-polymer entities, this data item is a pointer to
         * _pdbx_reference_entity_nonpoly.chem_comp_id in the
         * PDBX_REFERENCE_ENTITY_NONPOLY category.
         */
        comp_id_1: str,
        /**
         * The component identifier in the second of the two entities containing the linkage.
         *
         * For polymer entities, this data item is a pointer to _pdbx_reference_entity_poly_seq.mon_id
         * in the PDBX_REFERENCE_ENTITY_POLY_SEQ category.
         *
         * For non-polymer entities, this data item is a pointer to
         * _pdbx_reference_entity_nonpoly.chem_comp_id in the
         * PDBX_REFERENCE_ENTITY_NONPOLY category.
         */
        comp_id_2: str,
        /**
         * The atom identifier/name in the first of the two entities containing the linkage.
         */
        atom_id_1: str,
        /**
         * The atom identifier/name in the second of the two entities containing the linkage.
         */
        atom_id_2: str,
        /**
         * The bond order target for the chemical linkage.
         */
        value_order: Aliased<'sing' | 'doub' | 'trip' | 'quad' | 'arom' | 'poly' | 'delo' | 'pi'>(str),
        /**
         * The entity component identifier for the first of two entities containing the linkage.
         */
        component_1: int,
        /**
         * The entity component identifier for the second of two entities containing the linkage.
         */
        component_2: int,
        /**
         * A code indicating the entity types involved in the linkage.
         */
        link_class: Aliased<'PP' | 'PN' | 'NP' | 'NN'>(str),
    },
    /**
     * Data items in the PDBX_REFERENCE_ENTITY_POLY_LINK category give details about
     * polymer linkages including both standard and non-standard linkages between
     * polymer componnents.
     */
    pdbx_reference_entity_poly_link: {
        /**
         * The value of _pdbx_reference_entity_poly_link.link_id uniquely identifies
         * a linkage within a polymer entity.
         */
        link_id: int,
        /**
         * The value of _pdbx_reference_entity_poly_link.prd_id is a reference
         * _pdbx_reference_entity_list.prd_id in the PDBX_REFERENCE_ENTITY_POLY category.
         */
        prd_id: str,
        /**
         * The reference entity id of the polymer entity containing the linkage.
         *
         * This data item is a pointer to _pdbx_reference_entity_poly.ref_entity_id
         * in the PDBX_REFERENCE_ENTITY_POLY category.
         */
        ref_entity_id: str,
        /**
         * The entity component identifier entity containing the linkage.
         */
        component_id: int,
        /**
         * For a polymer entity, the sequence number in the first of
         * the two components making the linkage.
         *
         * This data item is a pointer to _pdbx_reference_entity_poly_seq.num
         * in the PDBX_REFERENCE_ENTITY_POLY_SEQ category.
         */
        entity_seq_num_1: int,
        /**
         * For a polymer entity, the sequence number in the second of
         * the two components making the linkage.
         *
         * This data item is a pointer to _pdbx_reference_entity_poly_seq.num
         * in the PDBX_REFERENCE_ENTITY_POLY_SEQ category.
         */
        entity_seq_num_2: int,
        /**
         * The component identifier in the first of the two components making the
         * linkage.
         *
         * This data item is a pointer to _pdbx_reference_entity_poly_seq.mon_id
         * in the PDBX_REFERENCE_ENTITY_POLY_SEQ category.
         */
        comp_id_1: str,
        /**
         * The component identifier in the second of the two components making the
         * linkage.
         *
         * This data item is a pointer to _pdbx_reference_entity_poly_seq.mon_id
         * in the PDBX_REFERENCE_ENTITY_POLY_SEQ category.
         */
        comp_id_2: str,
        /**
         * The atom identifier/name in the first of the two components making
         * the linkage.
         */
        atom_id_1: str,
        /**
         * The atom identifier/name in the second of the two components making
         * the linkage.
         */
        atom_id_2: str,
        /**
         * The bond order target for the non-standard linkage.
         */
        value_order: Aliased<'sing' | 'doub' | 'trip' | 'quad' | 'arom' | 'poly' | 'delo' | 'pi'>(str),
    },
    /**
     * Data items in the PDBX_MOLECULE category identify reference molecules
     * within a PDB entry.
     */
    pdbx_molecule: {
        /**
         * The value of _pdbx_molecule.prd_id is the PDB accession code for this
         * reference molecule.
         */
        prd_id: str,
        /**
         * The value of _pdbx_molecule.instance_id is identifies a particular molecule
         * in the molecule list.
         */
        instance_id: int,
        /**
         * A reference to _struct_asym.id in the STRUCT_ASYM category.
         */
        asym_id: str,
    },
    /**
     * Data items in the PDBX_MOLECULE_FEATURES category record features of molecules
     * within a PDB entry.
     */
    pdbx_molecule_features: {
        /**
         * The value of _pdbx_molecule_features.prd_id is the PDB accession code for this
         * reference molecule.
         */
        prd_id: str,
        /**
         * Broadly defines the function of the molecule.
         */
        class: Aliased<'Antagonist' | 'Antibiotic' | 'Anticancer' | 'Anticoagulant' | 'Antifungal' | 'Antigen' | 'Antiinflammatory' | 'Antimicrobial' | 'Antineoplastic' | 'Antiparasitic' | 'Antiretroviral' | 'Anthelmintic' | 'Antithrombotic' | 'Antitumor' | 'Antiviral' | 'CASPASE inhibitor' | 'Chaperone binding' | 'Enzyme inhibitor' | 'Drug delivery' | 'Glycan component' | 'Growth factor' | 'Immunosuppressant' | 'Inducer' | 'Inhibitor' | 'Lantibiotic' | 'Metabolism' | 'Metal transport' | 'Nutrient' | 'Oxidation-reduction' | 'Protein binding' | 'Receptor' | 'Substrate analog' | 'Synthetic opioid' | 'Thrombin inhibitor' | 'Transition state mimetic' | 'Transport activator' | 'Trypsin inhibitor' | 'Toxin' | 'Unknown' | 'Water retention' | 'Anticoagulant, Antithrombotic' | 'Antibiotic, Antimicrobial' | 'Antibiotic, Anthelmintic' | 'Antibiotic, Antineoplastic' | 'Antimicrobial, Antiretroviral' | 'Antimicrobial, Antitumor' | 'Antimicrobial, Antiparasitic, Antibiotic' | 'Thrombin inhibitor, Trypsin inhibitor'>(str),
        /**
         * Defines the structural classification of the molecule.
         */
        type: Aliased<'Amino acid' | 'Aminoglycoside' | 'Anthracycline' | 'Anthraquinone' | 'Ansamycin' | 'Chalkophore' | 'Chromophore' | 'Glycopeptide' | 'Cyclic depsipeptide' | 'Cyclic lipopeptide' | 'Cyclic peptide' | 'Heterocyclic' | 'Imino sugar' | 'Keto acid' | 'Lipoglycopeptide' | 'Lipopeptide' | 'Macrolide' | 'Non-polymer' | 'Nucleoside' | 'Oligopeptide' | 'Oligosaccharide' | 'Peptaibol' | 'Peptide-like' | 'Polycyclic' | 'Polypeptide' | 'Polysaccharide' | 'Quinolone' | 'Thiolactone' | 'Thiopeptide' | 'Siderophore' | 'Unknown' | 'Chalkophore, Polypeptide'>(str),
        /**
         * A name of the molecule.
         */
        name: str,
        /**
         * Additional details describing the molecule.
         */
        details: str,
    },
    /**
     * Data items in the ENTITY_SRC_NAT category record details of
     * the source from which the entity was obtained in cases
     * where the entity was isolated directly from a natural tissue.
     */
    entity_src_nat: {
        /**
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * Scientific name of the organism of the natural source.
         */
        pdbx_organism_scientific: str,
        /**
         * The plasmid containing the gene.
         */
        pdbx_plasmid_name: str,
        /**
         * This data item is an ordinal identifier for entity_src_nat data records.
         */
        pdbx_src_id: int,
        /**
         * The beginning polymer sequence position for the polymer section corresponding
         * to this source.
         *
         * A reference to the sequence position in the entity_poly category.
         */
        pdbx_beg_seq_num: int,
        /**
         * The ending polymer sequence position for the polymer section corresponding
         * to this source.
         *
         * A reference to the sequence position in the entity_poly category.
         */
        pdbx_end_seq_num: int,
    },
    /**
     * Data items in the ENTITY_SRC_GEN category record details of
     * the source from which the entity was obtained in cases
     * where the source was genetically manipulated.  The
     * following are treated separately:  items pertaining to the tissue
     * from which the gene was obtained, items pertaining to the host
     * organism for gene expression and items pertaining to the actual
     * producing organism (plasmid).
     */
    entity_src_gen: {
        /**
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * Identifies the gene.
         */
        pdbx_gene_src_gene: List(',', x => x),
        /**
         * Scientific name of the organism.
         */
        pdbx_gene_src_scientific_name: str,
        /**
         * The name of the plasmid that produced the entity in the host
         * organism. Where full details of the protein production are available
         * it would be expected that this item would be derived from
         * _pdbx_construct.name of the construct pointed to from
         * _entity_src_gen_express.plasmid_id.
         */
        plasmid_name: str,
        /**
         * This data item is an ordinal identifier for entity_src_gen data records.
         */
        pdbx_src_id: int,
        /**
         * The beginning polymer sequence position for the polymer section corresponding
         * to this source.
         *
         * A reference to the sequence position in the entity_poly category.
         */
        pdbx_beg_seq_num: int,
        /**
         * The ending polymer sequence position for the polymer section corresponding
         * to this source.
         *
         * A reference to the sequence position in the entity_poly category.
         */
        pdbx_end_seq_num: int,
    },
    /**
     * The data items in category PDBX_ENTITY_SRC_SYN record the source details
     * about chemically synthesized molecules.
     */
    pdbx_entity_src_syn: {
        /**
         * The scientific name of the organism from which the sequence of
         * the synthetic entity was derived.
         */
        organism_scientific: str,
        /**
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * This data item is an ordinal identifier for pdbx_entity_src_syn data records.
         */
        pdbx_src_id: int,
        /**
         * The beginning polymer sequence position for the polymer section corresponding
         * to this source.
         *
         * A reference to the sequence position in the entity_poly category.
         */
        pdbx_beg_seq_num: int,
        /**
         * The ending polymer sequence position for the polymer section corresponding
         * to this source.
         *
         * A reference to the sequence position in the entity_poly category.
         */
        pdbx_end_seq_num: int,
    },
    /**
     * Data items in the PDBX_ENTITY_BRANCH_DESCRIPTOR category provide
     * string descriptors of entity chemical structure.
     */
    pdbx_entity_branch_descriptor: {
        /**
         * This data item is a pointer to _entity_poly.entity_id in the ENTITY
         * category.
         */
        entity_id: str,
        /**
         * This data item contains the descriptor value for this
         * entity.
         */
        descriptor: str,
        /**
         * This data item contains the descriptor type.
         */
        type: Aliased<'LINUCS' | 'Glycam Condensed Sequence' | 'Glycam Condensed Core Sequence' | 'WURCS'>(str),
        /**
         * This data item contains the name of the program
         * or library used to compute the descriptor.
         */
        program: str,
        /**
         * This data item contains the version of the program
         * or library used to compute the descriptor.
         */
        program_version: str,
        /**
         * Ordinal index for this category.
         */
        ordinal: int,
    },
    /**
     * Data items in the pdbx_entity_instance_feature category records
     * special features of selected entity instances.
     */
    pdbx_entity_instance_feature: {
        /**
         * Special structural details about this entity instance.
         */
        details: str,
        /**
         * A feature type associated with entity instance.
         */
        feature_type: Aliased<'SUBJECT OF INVESTIGATION' | 'NO FUNCTIONAL ROLE' | 'OTHER'>(str),
        /**
         * Author instance identifier (formerly PDB Chain ID)
         */
        auth_asym_id: str,
        /**
         * Instance identifier for this entity.
         */
        asym_id: str,
        /**
         * Author provided residue number.
         */
        auth_seq_num: str,
        /**
         * Position in the sequence.
         */
        seq_num: int,
        /**
         * Chemical component identifier
         */
        comp_id: str,
        /**
         * The author provided chemical component identifier
         */
        auth_comp_id: str,
        /**
         * An ordinal index for this category
         */
        ordinal: int,
    },
    /**
     * Data items in the PDBX_ENTITY_BRANCH_LIST category specify the list
     * of monomers in a branched entity.  Allowance is made for the possibility
     * of microheterogeneity in a sample by allowing a given sequence
     * number to be correlated with more than one monomer ID. The
     * corresponding ATOM_SITE entries should reflect this
     * heterogeneity.
     */
    pdbx_entity_branch_list: {
        /**
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * A flag to indicate whether this monomer in the entity is
         * heterogeneous in sequence.
         */
        hetero: Aliased<'no' | 'n' | 'yes' | 'y'>(str),
        /**
         * This data item is a pointer to _chem_comp.id in the CHEM_COMP
         * category.
         */
        comp_id: str,
        /**
         * The value pair  _pdbx_entity_branch_list.num and _pdbx_entity_branch_list.comp_id
         * must uniquely identify a record in the PDBX_ENTITY_BRANCH_LIST list.
         */
        num: int,
    },
    /**
     * Data items in the PDBX_ENTITY_BRANCH_LINK category give details about
     * the linkages between components within a branched entity.
     */
    pdbx_entity_branch_link: {
        /**
         * The value of _pdbx_entity_branch_link.link_id uniquely identifies
         * linkages within the branched entity.
         */
        link_id: int,
        /**
         * A description of special aspects of this linkage.
         */
        details: str,
        /**
         * The entity id for this branched entity.
         *
         * This data item is a pointer to _pdbx_entity_branch_list.entity_id
         * in the PDBX_ENTITY_BRANCH_LIST category.
         */
        entity_id: str,
        /**
         * The component number for the first component making the linkage.
         *
         * This data item is a pointer to _pdbx_entity_branch_list.num
         * in the PDBX_ENTITY_BRANCH_LIST category.
         */
        entity_branch_list_num_1: int,
        /**
         * The component number for the second component making the linkage.
         *
         * This data item is a pointer to _pdbx_entity_branch_list.num
         * in the PDBX_ENTITY_BRANCH_LIST category.
         */
        entity_branch_list_num_2: int,
        /**
         * The component identifier for the first component making the linkage.
         *
         * This data item is a pointer to _pdbx_entity_branch_list.comp_id
         * in the PDBX_ENTITY_BRANCH_LIST category.
         */
        comp_id_1: str,
        /**
         * The component identifier for the second component making the linkage.
         *
         * This data item is a pointer to _pdbx_entity_branch_list.comp_id
         * in the PDBX_ENTITY_BRANCH_LIST category.
         */
        comp_id_2: str,
        /**
         * The atom identifier/name for the first atom making the linkage.
         */
        atom_id_1: str,
        /**
         * The leaving atom identifier/name bonded to the first atom making the linkage.
         */
        leaving_atom_id_1: str,
        /**
         * The chiral configuration of the first atom making the linkage.
         */
        atom_stereo_config_1: Aliased<'R' | 'S' | 'N'>(str),
        /**
         * The atom identifier/name for the second atom making the linkage.
         */
        atom_id_2: str,
        /**
         * The leaving atom identifier/name bonded to the second atom making the linkage.
         */
        leaving_atom_id_2: str,
        /**
         * The chiral configuration of the second atom making the linkage.
         */
        atom_stereo_config_2: Aliased<'R' | 'S' | 'N'>(str),
        /**
         * The bond order target for the chemical linkage.
         */
        value_order: Aliased<'sing' | 'doub' | 'trip' | 'quad' | 'arom' | 'poly' | 'delo' | 'pi'>(str),
    },
    /**
     * Data items in the PDBX_ENTITY_BRANCH category specify the list
     * of branched entities and the type.
     */
    pdbx_entity_branch: {
        /**
         * The entity id for this branched entity.
         *
         * This data item is a pointer to _entity.id
         */
        entity_id: str,
        /**
         * The type of this branched oligosaccharide.
         */
        type: Aliased<'oligosaccharide'>(str),
    },
    /**
     * The PDBX_BRANCH_SCHEME category provides residue level nomenclature
     * mapping for branch chain entities.
     */
    pdbx_branch_scheme: {
        /**
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * A flag to indicate whether this monomer in the entity is
         * heterogeneous in sequence.
         */
        hetero: Aliased<'no' | 'n' | 'yes' | 'y'>(str),
        /**
         * Pointer to _atom_site.label_asym_id.
         */
        asym_id: str,
        /**
         * This data item is a pointer to _atom_site.label_comp_id in the
         * PDBX_ENTITY_BRANCH_LIST category.
         */
        mon_id: str,
        /**
         * This data item is a pointer to _pdbx_entity_branch_list.num in the
         * PDBX_ENTITY_BRANCH_LIST category.
         */
        num: int,
        /**
         * This data item is a pointer to _atom_site.auth_asym_id in the
         * ATOM_SITE category.
         */
        pdb_asym_id: str,
        /**
         * This data item is a pointer to _atom_site.auth_seq_id in the
         * ATOM_SITE category.
         */
        pdb_seq_num: str,
        /**
         * This data item is a pointer to _atom_site.auth_comp_id in the
         * ATOM_SITE category.
         */
        pdb_mon_id: str,
        /**
         * This data item is a pointer to _atom_site.pdbx_auth_asym_id in the
         * ATOM_SITE category.
         */
        auth_asym_id: str,
        /**
         * This data item is a pointer to _atom_site.pdbx_auth_seq_id in the
         * ATOM_SITE category.
         */
        auth_seq_num: str,
        /**
         * This data item is a pointer to _atom_site.pdbx_auth_comp_id in the
         * ATOM_SITE category.
         */
        auth_mon_id: str,
    },
    /**
     * PDBX_CHEM_COMP_RELATED describes the relationship between two chemical components.
     */
    pdbx_chem_comp_related: {
        /**
         * The chemical component for which this relationship applies.
         */
        comp_id: str,
        /**
         * The related chemical component for which this chemical component is based.
         */
        related_comp_id: str,
        /**
         * Describes the type of relationship
         */
        relationship_type: Aliased<'Carbohydrate core' | 'Precursor'>(str),
        /**
         * Describes the type of relationship
         */
        details: str,
    },
    /**
     * Data items in the IHM_STARTING_MODEL_DETAILS category records the
     * details about structural models used as starting inputs in
     * the integrative model building process.
     */
    ihm_starting_model_details: {
        /**
         * A unique identifier for the starting structural model.
         */
        starting_model_id: str,
        /**
         * A unique identifier for the distinct molecular entities.
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * A text description of the molecular entity
         */
        entity_description: str,
        /**
         * An asym/strand identifier for the entity molecule.
         * This data item is a pointer to _struct_asym.id in the
         * STRUCT_ASYM category.
         */
        asym_id: str,
        /**
         * The identifier for the polymeric segment modeled using this starting model.
         * This data item is a pointer to _ihm_entity_poly_segment.id in the
         * IHM_ENTITY_POLY_SEGMENT category.
         */
        entity_poly_segment_id: int,
        /**
         * The source of the starting model.
         */
        starting_model_source: Aliased<'comparative model' | 'experimental model' | 'integrative model' | 'ab initio model' | 'other'>(str),
        /**
         * The author assigned chainId/auth_asym_id corresponding to this starting model.
         * This corresponds to the chainId/auth_asym_id of the experimental models in the
         * PDB or comparative models in the Model Archive or the starting models referenced
         * via a DOI. If starting models are included in IHM_STARTING_MODEL_COORD, then
         * this will be the same as _ihm_starting_model_details.asym_id.
         */
        starting_model_auth_asym_id: str,
        /**
         * The offset in residue numbering between the starting model and the deposited I/H model, if applicable.
         * I/H model residue number = Starting model residue number + offset
         */
        starting_model_sequence_offset: int,
        /**
         * Identifier to the starting model (comparative, experimental or integrative)
         * used as input in the integrative modeling.
         * This data item is a pointer to the _ihm_dataset_list.id in the
         * IHM_DATASET_LIST category.
         */
        dataset_list_id: int,
    },
    /**
     * Data items in the IHM_STARTING_COMPARATIVE_MODELS category records
     * additional details about comparative models used as starting inputs in
     * the integrative model building process.
     */
    ihm_starting_comparative_models: {
        /**
         * A unique identifier for the starting comparative model.
         */
        id: int,
        /**
         * The identifier for the starting structural model.
         * This data item is a pointer to _ihm_starting_model_details.starting_model_id
         * in the IHM_STARTING_MODEL_DETAILS category.
         */
        starting_model_id: str,
        /**
         * The chainId/auth_asym_id corresponding to the starting model.
         */
        starting_model_auth_asym_id: str,
        /**
         * The starting residue index of the starting model.
         */
        starting_model_seq_id_begin: int,
        /**
         * The ending residue index of the starting model.
         */
        starting_model_seq_id_end: int,
        /**
         * The chainId/auth_asym_id corresponding to the template.
         */
        template_auth_asym_id: str,
        /**
         * The starting residue index of the template.
         */
        template_seq_id_begin: int,
        /**
         * The ending residue index of the template.
         */
        template_seq_id_end: int,
        /**
         * The percentage sequence identity between the template sequence and the comparative model sequence.
         */
        template_sequence_identity: float,
        /**
         * The denominator used while calculating the sequence identity provided in
         * _ihm_starting_comparative_models.template_sequence_identity.
         */
        template_sequence_identity_denominator: Aliased<'1' | '2' | '3' | '4' | '5'>(int),
        /**
         * The dataset list id corresponding to the template used to obtain the comparative model.
         * This data item is a pointer to _ihm_dataset_list.id in the IHM_DATASET_LIST category.
         */
        template_dataset_list_id: int,
        /**
         * The file id corresponding to the sequence alignment of the template sequence and the comparative model sequence.
         * This data item is a pointer to _ihm_external_files.id in the IHM_EXTERNAL_FILES category.
         */
        alignment_file_id: int,
    },
    /**
     * Data items in the IHM_STARTING_MODEL_SEQ_DIF category provide a
     * mechanism for indicating and annotating point differences
     * between the sequence of the entity or biological unit described
     * in the data block and the sequence of the starting model used in
     * the integrative modeling referenced from a database. The point
     * differences may be due to point mutations introduced in the
     * starting model or the presence of modified amino acid residues.
     */
    ihm_starting_model_seq_dif: {
        /**
         * A unique identifier for the entry.
         */
        id: int,
        /**
         * A unique identifier for the distinct molecular entities.
         * This data item is a pointer to _entity_poly_seq.entity_id in the ENTITY_POLY category.
         */
        entity_id: str,
        /**
         * An asym/strand identifier for the entity molecule.
         * This data item is a pointer to _struct_asym.id in the
         * STRUCT_ASYM category.
         */
        asym_id: str,
        /**
         * The residue index.
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id: int,
        /**
         * The component identifier for the residue.
         * This data item is a pointer to _entity_poly_seq.mon_id in the ENTITY_POLY_SEQ category.
         */
        comp_id: str,
        /**
         * Unique identifier for the starting model record.
         * This data item is a pointer to _ihm_starting_model_details.starting_model_id in the
         * IHM_STARTING_MODEL_DETAILS category.
         */
        starting_model_id: str,
        /**
         * The asym/strand identifier for the entity molecule of the database starting model.
         */
        db_asym_id: str,
        /**
         * The corresponding residue index of the database starting model.
         */
        db_seq_id: int,
        /**
         * The correspinding component identifier for the residue in the database starting model.
         */
        db_comp_id: str,
        /**
         * A description of special aspects of the point differences
         * between the sequence of the entity or biological unit described
         * in the data block and that in the starting model referenced
         * from a database.
         */
        details: str,
    },
    /**
     * Data items in the IHM_MODEL_REPRESENTATION category lists the
     * various mono or multi-scale model representations used in the
     * integrative modeling study.
     */
    ihm_model_representation: {
        /**
         * A unique identifier for the model representation.
         */
        id: int,
        /**
         * Name/brief description for the model representation.
         */
        name: str,
        /**
         * Additional details about the model representation.
         */
        details: str,
    },
    /**
     * Data items in the IHM_MODEL_REPRESENTATION_DETAILS category records the
     * details about the architecture and representation of structural
     * models involved in the integrative modeling study.
     */
    ihm_model_representation_details: {
        /**
         * A unique identifier for the category.
         */
        id: int,
        /**
         * An identifier that collects or groups together a set of representations.
         * This data item is a pointer to _ihm_model_representation.id in the
         * IHM_MODEL_REPRESENTATION category.
         */
        representation_id: int,
        /**
         * The identifier for the polymeric segment in the representation.
         * This data item is a pointer to _ihm_entity_poly_segment.id in the
         * IHM_ENTITY_POLY_SEGMENT category.
         */
        entity_poly_segment_id: int,
        /**
         * A unique identifier distinct molecular entities.
         * This data item is a pointer to _entity.id in the
         * ENTITY category.
         */
        entity_id: str,
        /**
         * A text description of the molecular entity
         */
        entity_description: str,
        /**
         * An asym/strand identifier for the entity molecule.
         * This data item is a pointer to _struct_asym.id in the
         * STRUCT_ASYM category.
         */
        entity_asym_id: str,
        /**
         * The primitive object used to model this segment.
         */
        model_object_primitive: Aliased<'atomistic' | 'sphere' | 'gaussian' | 'other'>(str),
        /**
         * The identifier for the starting structural model.
         * This data item is a pointer to _ihm_starting_model_details.starting_model_id
         * in the IHM_STARTING_MODEL_DETAILS category.
         */
        starting_model_id: str,
        /**
         * The manner in which the segment is modeled.
         */
        model_mode: Aliased<'rigid' | 'flexible'>(str),
        /**
         * The level of detail at which model primitive objects are applied to the structure.
         */
        model_granularity: Aliased<'by-atom' | 'by-residue' | 'multi-residue' | 'by-feature'>(str),
        /**
         * The number of primitive objects used to model a feature in the case of 'by-feature' granularity.
         */
        model_object_count: int,
    },
    /**
     * Data items in the IHM_STRUCT_ASSEMBLY_DETAILS category records
     * the details of the structural assemblies and used in the
     * integrative modeling.
     */
    ihm_struct_assembly_details: {
        /**
         * A unique identifier for the structural assembly description.
         */
        id: int,
        /**
         * An identifier for the structural assembly.
         * This data item will remain the same for all components
         * of an assembly.
         * This data item is a pointer to _ihm_struct_assembly.id
         * in the IHM_STRUCT_ASSEMBLY category.
         */
        assembly_id: int,
        /**
         * The parent of this assembly in a hierarchy.
         * This data item is a pointer to _ihm_struct_assembly.id in the
         * IHM_STRUCT_ASSEMBLY category.
         * This data item should point to the assembly id of the immediate
         * parent in a hierarchy.
         * By convention, the full assembly (top of hierarchy) is assigned parent id 0 (zero).
         * In case of assemblies that do not conform to a hierarchy,
         * _ihm_struct_assembly_details.parent_assembly_id is the same as
         * _ihm_struct_assembly_details.assembly_id indicating a self-parent.
         */
        parent_assembly_id: int,
        /**
         * A text description of the molecular entity
         */
        entity_description: str,
        /**
         * A unique identifier for distinct molecular entities.
         * This data item is a pointer to _entity.id in the
         * ENTITY category.
         */
        entity_id: str,
        /**
         * An asym/strand identifier for the component in the assembly.
         * This data item is a pointer to _struct_asym.id in the
         * STRUCT_ASYM category.
         */
        asym_id: str,
        /**
         * The identifier for the polymeric segment in the assembly.
         * This data item is a pointer to _ihm_entity_poly_segment.id in the
         * IHM_ENTITY_POLY_SEGMENT category.
         */
        entity_poly_segment_id: int,
    },
    /**
     * Data items in the IHM_STRUCT_ASSEMBLY category lists
     * all the structural assemblies used in the integrative
     * modeling study.
     */
    ihm_struct_assembly: {
        /**
         * A unique identifier for the structural assembly.
         */
        id: int,
        /**
         * A name for the structural assembly.
         */
        name: str,
        /**
         * Description of the structural assembly.
         */
        description: str,
    },
    /**
     * Data items in the IHM_MODELING_PROTOCOL category lists all
     * modeling protocols used in the integrative modeling study.
     */
    ihm_modeling_protocol: {
        /**
         * A unique identifier for the modeling protocol.
         */
        id: int,
        /**
         * Number of independent steps in the modeling protocol.
         */
        num_steps: int,
        /**
         * The name for the modeling protocol.
         */
        protocol_name: str,
    },
    /**
     * Data items in the IHM_MODELING_PROTOCOL_DETAILS category records the
     * step-wise details of the integrative modeling workflow.
     */
    ihm_modeling_protocol_details: {
        /**
         * A unique identifier for the modeling protocol/step combination.
         */
        id: int,
        /**
         * An index for the modeling protocol carried out.
         * This data item is a pointer to _ihm_modeling_protocol.id in the
         * IHM_MODELING_PROTOCOL category.
         */
        protocol_id: int,
        /**
         * An index for a particular step within the modeling protocol.
         */
        step_id: int,
        /**
         * An index for the structural assembly being modeled.
         * This is an indicator to whether the whole assembly is modeled
         * or if only a subset of the structural assembly is modeled.
         * This data item is a pointer to _ihm_struct_assembly.id in the
         * IHM_STRUCT_ASSEMBLY category. The IHM_STRUCT_ASSEMBLY category provides the
         * details regarding the different structural assemblies used in the modeling.
         * The default value for this data item is "1", indicating that the entire
         * assembly is being modeled.
         */
        struct_assembly_id: int,
        /**
         * An index for the dataset group being used in the modeling protocol.
         * This data item is a pointer to the _ihm_dataset_group.id in the
         * IHM_DATASET_GROUP category.
         */
        dataset_group_id: int,
        /**
         * A textual description of the structural assembly being modeled.
         */
        struct_assembly_description: str,
        /**
         * The name or type of the modeling step.
         */
        step_name: str,
        /**
         * Description of the method involved in the modeling step.
         */
        step_method: str,
        /**
         * The number of models in the beginning of the step.
         */
        num_models_begin: int,
        /**
         * The number of models at the end of the step.
         */
        num_models_end: int,
        /**
         * A flag to indicate if the modeling is multi scale.
         */
        multi_scale_flag: Aliased<'YES' | 'NO'>(str),
        /**
         * A flag to indicate if the modeling is multi state.
         */
        multi_state_flag: Aliased<'YES' | 'NO'>(str),
        /**
         * A flag to indicate if the modeling involves an ensemble ordered by time or other order.
         */
        ordered_flag: Aliased<'YES' | 'NO'>(str),
        /**
         * The file id corresponding to the script used in the modeling protocol step.
         * This data item is a pointer to _ihm_external_files.id in the IHM_EXTERNAL_FILES category.
         */
        script_file_id: int,
        /**
         * Identifier to the software used in the modeling protocol step.
         * This data item is a pointer to the _software.pdbx_ordinal in the
         * SOFTWARE category.
         */
        software_id: int,
    },
    /**
     * Data items in the IHM_MULTI_STATE_MODELING category records the
     * details of the multi-state modeling protocol, if applicable.
     */
    ihm_multi_state_modeling: {
        /**
         * A unique identifier for a particular state in the multi-state modeling.
         */
        state_id: int,
        /**
         * An identifier for a collections of states in the multi-state modeling.
         * This data item can be used when structural models belong to diffent
         * multi-state modeling types.
         */
        state_group_id: int,
        /**
         * A fraction representing the population of the particular state.
         */
        population_fraction: float,
        /**
         * The standard deviation of the population fraction.
         */
        population_fraction_sd: float,
        /**
         * The type that the multiple states being modeled belong to.
         */
        state_type: str,
        /**
         * A descriptive name for the state.
         */
        state_name: str,
        /**
         * The type of multi-state modeling experiment carried out.
         */
        experiment_type: Aliased<'Fraction of bulk' | 'Single molecule'>(str),
        /**
         * Additional textual details of the multi-state modeling, if required.
         */
        details: str,
    },
    /**
     * Data items in the IHM_MODELING_POST_PROCESS category records
     * the details of the post processing of the models/results of
     * the modeling protocol.
     */
    ihm_modeling_post_process: {
        /**
         * A unique identifier for the post modeling analysis/step combination.
         */
        id: int,
        /**
         * An identifier for the modeling protocol, whose post modeling analysis
         * is being carried out.
         * This data item is a pointer to the _ihm_modeling_protocol.id
         * in the IHM_MODELING_PROTOCOL category.
         */
        protocol_id: int,
        /**
         * An identifier for the post modeling analysis. This data item accounts for
         * multiple post-modeling analyses that can be carried out.
         */
        analysis_id: int,
        /**
         * In a multi-step process, this identifier denotes the particular
         * step in the post modeling analysis.
         */
        step_id: int,
        /**
         * The type of post modeling analysis being carried out.
         */
        type: Aliased<'filter' | 'cluster' | 'rescore' | 'validation' | 'other' | 'none'>(str),
        /**
         * The parameter/feature used in the post modeling analysis.
         */
        feature: Aliased<'energy/score' | 'RMSD' | 'dRMSD' | 'other' | 'none'>(str),
        /**
         * The number of models at the beginning of the post processing step.
         */
        num_models_begin: int,
        /**
         * The number of models the the end of the post processing step.
         */
        num_models_end: int,
    },
    /**
     * Data items in the IHM_ENSEMBLE_INFO category records the
     * details of the model clusters or ensembles obtained after
     * sampling.
     */
    ihm_ensemble_info: {
        /**
         * A unique id for the ensemble.
         */
        ensemble_id: int,
        /**
         * An optional name for the cluster or ensemble for better description.
         */
        ensemble_name: str,
        /**
         * An identifier for the post modeling analyses carried out.
         * This data item is a pointer to _ihm_modeling_post_process.id in
         * the IHM_MODELING_POST_PROCESS category.
         */
        post_process_id: int,
        /**
         * An identifier for the cluster or group of models being deposited.
         * This data item is a pointer to the _ihm_model_group.id
         * in the IHM_MODEL_GROUP category.
         */
        model_group_id: int,
        /**
         * The clustering method used to obtain the ensemble, if applicable.
         */
        ensemble_clustering_method: Aliased<'Hierarchical' | 'Partitioning (k-means)' | 'Other'>(str),
        /**
         * The parameter/feature used for clustering the models, if applicable.
         */
        ensemble_clustering_feature: Aliased<'RMSD' | 'dRMSD' | 'other'>(str),
        /**
         * The number of models in the current ensemble being described.
         */
        num_ensemble_models: int,
        /**
         * The number of models from the current ensemble that is deposited.
         */
        num_ensemble_models_deposited: int,
        /**
         * The precision of each cluster or ensemble is calculated as dRMSD, which
         * is the average C-alpha distance root mean square deviation (dRMSD)
         * between the individual models in the cluster and the cluster centroid.
         * The cluster centroid is defined as the model with the minimal sum of
         * dRMSDs to the other models in the cluster or ensemble.
         */
        ensemble_precision_value: float,
        /**
         * A reference to the external file containing the structural models
         * in the ensemble. The number of models in the external file should
         * correspond to the number of models in the ensemble. This data item
         * is a pointer to _ihm_external_files.id in the IHM_EXTERNAL_FILES
         * category.
         * It is recommended that the large ensemble files be stored as separate
         * zip files within the same DOI. It is also recommended that large sphere
         * model ensembles be in binary format, which facilitates faster access.
         * Currently, a binary dump of co-ordinates in dcd format is suggested.
         * The topology can be inferred from the IHM_SPHERE_OBJ_SITE and the
         * ATOM_SITE categories in the corresponding mmCIF file.
         */
        ensemble_file_id: int,
    },
    /**
     * Data items in the IHM_MODEL_LIST category record the
     * details of the models being deposited.
     */
    ihm_model_list: {
        /**
         * A unique identifier for the structural model being deposited.
         */
        model_id: int,
        /**
         * A decsriptive name for the model.
         */
        model_name: str,
        /**
         * An identifier to the structure assembly corresponding to the model.
         * This data item is a pointer to the _ihm_struct_assembly.id
         * in the IHM_STRUCT_ASSEMBLY category.
         */
        assembly_id: int,
        /**
         * An identifier to the modeling protocol that produced the model.
         * This data item is a pointer to the _ihm_modeling_protocol.id
         * in the IHM_MODELING_PROTOCOL category.
         */
        protocol_id: int,
        /**
         * An identifier to the multi-scale model representation id of the model.
         * This data item is a pointer to the _ihm_model_representation.id
         * in the IHM_MODEL_REPRESENTATION category.
         */
        representation_id: int,
    },
    /**
     * IHM_MODEL_GROUP category defines collections or groups of integrative
     * structural models.
     */
    ihm_model_group: {
        /**
         * A unique identifier for a collection or group of structural models.
         * This data item can be used to group models into structural clusters
         * or using other criteria based on experimental data or other
         * relationships such as those belonging to the same state or time stamp.
         * An ensemble of models and its representative can either be grouped together
         * or can be separate groups in the ihm_model_group table. The choice between
         * the two options should be decided based on how the modeling was carried out
         * and how the representative was chosen. If the representative is a member of
         * the ensemble (i.e., best scoring model), then it is recommended that the
         * representative and the ensemble belong to the same model group. If the
         * representative is calculated from the ensemble (i.e., centroid), then it is
         * recommended that the representative be separated into a different group.
         */
        id: int,
        /**
         * A name for the collection of models.
         */
        name: str,
        /**
         * Additional details about the collection of models.
         */
        details: str,
    },
    /**
     * IHM_MODEL_GROUP_LINK category provides the list of models present in
     * a particular model group.
     */
    ihm_model_group_link: {
        /**
         * An identifier for the structural model.
         * This data item is a pointer to _ihm_model_list.model_id in the
         * IHM_MODEL_LIST category.
         */
        model_id: int,
        /**
         * An identifier for the structural model group.
         * This data item is a pointer to _ihm_model_group.id in the
         * IHM_MODEL_GROUP category.
         */
        group_id: int,
    },
    /**
     * Data items in the IHM_MODEL_REPRESENTATIVE category record the
     * details of the representative model in an ensemble or cluster.
     */
    ihm_model_representative: {
        /**
         * A unique identifier for the representative of the model group.
         */
        id: int,
        /**
         * The model group identifier corresponding to the representative model.
         * This data item is a pointer to _ihm_model_group.id in the
         * IHM_MODEL_GROUP category.
         */
        model_group_id: int,
        /**
         * The model identifier corresponding to the representative model.
         * This data item is a pointer to _ihm_model_list.model_id in the
         * IHM_MODEL_LIST category.
         */
        model_id: int,
        /**
         * The selection criteria based on which the representative is chosen.
         */
        selection_criteria: Aliased<'medoid' | 'closest to the average' | 'lowest energy' | 'target function' | 'fewest violations' | 'minimized average structure' | 'best scoring model' | 'centroid' | 'other selction criteria'>(str),
    },
    /**
     * Category holds the list of all datasets used in the IHM modeling.
     * These can be datasets archived in other related databases such as
     * BMRB, EMDB, EMPIAR, SASBDB, PRIDE etc., or can be hosted in other
     * places such as the authors website, github etc. These datasets are
     * elaborated in detail in the IHM_DATASET_RELATED_DB_REFERENCE and/or
     * the IHM_DATASET_EXTERNAL_REFERENCE categories. This category
     * holds the list of all datasets used.
     */
    ihm_dataset_list: {
        /**
         * A unique identifier for the dataset.
         */
        id: int,
        /**
         * The type of data held in the dataset.
         */
        data_type: Aliased<'NMR data' | '3DEM volume' | '2DEM class average' | 'EM raw micrographs' | 'X-ray diffraction data' | 'SAS data' | 'CX-MS data' | 'Mass Spectrometry data' | 'EPR data' | 'H/D exchange data' | 'Single molecule FRET data' | 'Experimental model' | 'Comparative model' | 'Integrative model' | 'De Novo model' | 'Predicted contacts' | 'Mutagenesis data' | 'DNA footprinting data' | 'Hydroxyl radical footprinting data' | 'Yeast two-hybrid screening data' | 'Quantitative measurements of genetic interactions' | 'Other'>(str),
        /**
         * A flag that indicates whether the dataset is archived in
         * an IHM related database or elsewhere.
         */
        database_hosted: Aliased<'YES' | 'NO'>(str),
    },
    /**
     * Category to define groups or collections of input datasets.
     */
    ihm_dataset_group: {
        /**
         * A unique identifier for the dataset group.
         */
        id: int,
        /**
         * A name for the dataset group.
         */
        name: str,
        /**
         * The application / utilization of the dataset group in modeling.
         */
        application: Aliased<'restraint' | 'validation' | 'filter' | 'representation' | 'sampling' | 'other'>(str),
        /**
         * Additional details regarding the dataset group.
         */
        details: str,
    },
    /**
     * IHM_DATASET_GROUP_LINK category provides the list of datasets present in
     * a particular group.
     */
    ihm_dataset_group_link: {
        /**
         * An identifier for the dataset.
         * This data item is a pointer to _ihm_dataset_list.id in the
         * IHM_DATASET_LIST category.
         */
        dataset_list_id: int,
        /**
         * An identifier for the dataset group.
         * This data item is a pointer to _ihm_dataset_group.id in the
         * IHM_DATASET_GROUP category.
         */
        group_id: int,
    },
    /**
     * Category holds information about related datasets, where one is derived from the other.
     */
    ihm_related_datasets: {
        /**
         * The dataset list id corresponding to the derived dataset.
         * This data item is a pointer to _ihm_dataset_list.id in the
         * IHM_DATASET_LIST category.
         */
        dataset_list_id_derived: int,
        /**
         * The primary dataset list id from which the corresponding derived dataset is obtained.
         * This data item is a pointer to _ihm_dataset_list.id in the
         * IHM_DATASET_LIST category.
         */
        dataset_list_id_primary: int,
    },
    /**
     * Category holds information related to data sources for the entry.
     * These can be datasets archived in other related databases such as
     * BMRB, EMDB, EMPIAR, SASBDB, PRIDE etc.
     */
    ihm_dataset_related_db_reference: {
        /**
         * A unique identifier for the related database entry.
         */
        id: int,
        /**
         * Identifier to the dataset list used in the IHM modeling.
         * This data item is a pointer to the _ihm_dataset_list.id in the
         * IHM_DATASET_LIST category.
         */
        dataset_list_id: int,
        /**
         * The name of the database containing the dataset entry.
         */
        db_name: Aliased<'PDB' | 'PDB-Dev' | 'BMRB' | 'EMDB' | 'EMPIAR' | 'SASBDB' | 'PRIDE' | 'MODEL ARCHIVE' | 'MASSIVE' | 'BioGRID' | 'Other'>(str),
        /**
         * The accession code for the database entry.
         */
        accession_code: str,
        /**
         * Version of the database entry, if the database allows versioning.
         */
        version: str,
        /**
         * Details regarding the dataset entry.
         */
        details: str,
    },
    /**
     * Category holds links to other external data sources for the I/H model entry.
     * Input datasets held in other databases such as EMDB, BMRB, SASBDB etc.
     * are referenced in the IHM_DATASET_RELATED_DB_REFERENCE category.
     * This data category, along with IHM_EXTERNAL_FILES category, holds information
     * regarding other non-database external data sources, such as  DOIs (digital
     * object identifiers) or supplementary files stored locally. The DOIs can either
     * lead to the external data file(s) directly (as in case of DOIs provided by the PDB)
     * or might lead to an HTML landing page (as provided by Zenodo). In the latter case,
     * additional URL (Uniform Resource Locator) information is required to retrieve
     * the external data file(s).
     */
    ihm_external_reference_info: {
        /**
         * A unique identifier for the external reference.
         */
        reference_id: int,
        /**
         * The name of the reference provider.
         */
        reference_provider: str,
        /**
         * The type of external reference.
         * Currently, only Digital Object Identifiers (DOIs) and supplementary files
         * stored locally are supported.
         */
        reference_type: Aliased<'DOI' | 'Supplementary Files'>(str),
        /**
         * The external reference or the Digital Object Identifier (DOI).
         * This field is not relevant for local files.
         */
        reference: str,
        /**
         * The type of object that the external reference points to, usually
         * a single file or an archive.
         */
        refers_to: Aliased<'File' | 'Archive' | 'Publication' | 'Other'>(str),
        /**
         * The Uniform Resource Locator (URL) corresponding to the external reference (DOI).
         * This URL should link to the corresponding downloadable file or archive and is provided
         * to enable automated software to download the referenced file or archive.
         */
        associated_url: str,
    },
    /**
     * Category provides details regarding external files. The IHM_EXTERNAL_REFERENCE_INFO
     * category captures the top-level details regarding external data sources.
     * This category captures the specific details regarding externally stored files
     * related to the particular I/H model entry.
     */
    ihm_external_files: {
        /**
         * A unique identifier for each external file.
         */
        id: int,
        /**
         * A pointer to the source of the external file - either DOI or locally stored.
         * This data item is a pointer to _ihm_external_reference_info.reference_id in the
         * IHM_EXTERNAL_REFERENCE_INFO category.
         */
        reference_id: int,
        /**
         * The relative path (including filename) for each external file.
         * Absolute paths (starting with "/") are not permitted.
         * This is required for identifying individual files from within
         * a tar-zipped archive file or for identifying supplementary local
         * files organized within a directory structure.
         * This data item assumes a POSIX-like directory structure or file path.
         */
        file_path: str,
        /**
         * The type of content in the file.
         */
        content_type: Aliased<'Input data or restraints' | 'Modeling or post-processing output' | 'Modeling workflow or script' | 'Visualization script' | 'Other'>(str),
        /**
         * Storage size of the external file in bytes.
         */
        file_size_bytes: float,
        /**
         * Additional textual details regarding the external file.
         */
        details: str,
    },
    /**
     * Category provides additional details regarding input data hosted externally
     * at other resources.
     */
    ihm_dataset_external_reference: {
        /**
         * A unique identifier for the external data.
         */
        id: int,
        /**
         * Identifier to the dataset list used in the I/H modeling.
         * This data item is a pointer to the _ihm_dataset_list.id in the
         * IHM_DATASET_LIST category.
         */
        dataset_list_id: int,
        /**
         * The file id corresponding to this external data file.
         * This data item is a pointer to _ihm_external_files.id
         * in the IHM_EXTERNAL_FILES category.
         */
        file_id: int,
    },
    /**
     * Data items in the IHM_LOCALIZATION_DENSITY_FILES category records the
     * details of files that provide information regarding localization densities
     * of ensembles. These may be stored externally as local files or linked via
     * DOI and can be in any accepted format that provides volume information
     * (CCP4, MRC, etc.).
     */
    ihm_localization_density_files: {
        /**
         * A unique identifier.
         */
        id: int,
        /**
         * The file id for the externally stored localization density file.
         * This data item is a pointer to _ihm_external_files.id
         * in the IHM_EXTERNAL_FILES category.
         */
        file_id: int,
        /**
         * The ensemble identifier for the ensemble, for which the localization density is provided.
         * This data item is a pointer to _ihm_ensemble_info.ensemble_id in the IHM_ENSEMBLE_INFO category.
         */
        ensemble_id: int,
        /**
         * The entity identifier corresponding to this localization density.
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * The identifier for the polymeric segment corresponding to this
         * localization density.
         * This data item is a pointer to _ihm_entity_poly_segment.id in the
         * IHM_ENTITY_POLY_SEGMENT category.
         */
        entity_poly_segment_id: int,
        /**
         * An asym/strand identifier corresponding to this localization density.
         * This data item is a pointer to _struct_asym.id in the STRUCT_ASYM category.
         */
        asym_id: str,
    },
    /**
     * Data items in the IHM_PREDICTED_CONTACT_RESTRAINT category records the
     * list of predicted contacts used in the integrative modeling experiment.
     * This has been adapted from the widely used CASP RR format
     * (http://www.predictioncenter.org/casp8/index.cgi?page=format#RR).
     * These contacts may be derived from various computational tools.
     * The software information can be provided in the SOFTWARE category.
     */
    ihm_predicted_contact_restraint: {
        /**
         * A unique identifier for the predicted contact restraint.
         */
        id: int,
        /**
         * An identifier to group the predicted contacts.
         */
        group_id: int,
        /**
         * The entity identifier for the first monomer partner in the predicted contact.
         * This data item is a pointer to _entity_poly_seq.entity_id in the ENTITY_POLY_SEQ category.
         */
        entity_id_1: str,
        /**
         * The entity identifier for the second monomer partner in the predicted contact.
         * This data item is a pointer to _entity_poly_seq.entity_id in the ENTITY_POLY_SEQ category.
         */
        entity_id_2: str,
        /**
         * An asym/strand identifier for the first monomer partner in the predicted contact.
         * This data item is a pointer to _struct_asym.id in the
         * STRUCT_ASYM category.
         */
        asym_id_1: str,
        /**
         * An asym/strand identifier for the second monomer partner in the predicted contact.
         * This data item is a pointer to _struct_asym.id in the
         * STRUCT_ASYM category.
         */
        asym_id_2: str,
        /**
         * The component identifier for the first monomer partner in the predicted contact.
         * This data item is a pointer to _entity_poly_seq.mon_id in the ENTITY_POLY_SEQ category.
         */
        comp_id_1: str,
        /**
         * The component identifier for the second monomer partner in the predicted contact.
         * This data item is a pointer to _entity_poly_seq.mon_id in the ENTITY_POLY_SEQ category.
         */
        comp_id_2: str,
        /**
         * The sequence index for the first monomer partner in the predicted contact.
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id_1: int,
        /**
         * The sequence index for the second monomer partner in the predicted contact.
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id_2: int,
        /**
         * If _ihm_predicted_contact_restraint.model_granularity is by-residue, then indicate the atom
         * used to represent the first monomer partner in three-dimension. Default is the C-alpha atom.
         */
        rep_atom_1: Aliased<'CA' | 'CB'>(str),
        /**
         * If _ihm_predicted_contact_restraint.model_granularity is by-residue, then indicate the atom
         * used to represent the second monomer partner in three-dimension. Default is the C-alpha atom.
         */
        rep_atom_2: Aliased<'CA' | 'CB'>(str),
        /**
         * The lower limit to the distance threshold applied to this predicted contact restraint
         * in the integrative modeling task.
         */
        distance_lower_limit: float,
        /**
         * The upper limit to the distance threshold applied to this predicted contact restraint
         * in the integrative modeling task.
         */
        distance_upper_limit: float,
        /**
         * The real number that indicates the probability that the predicted distance restraint
         * is correct. This number should fall between 0.0 and 1.0.
         */
        probability: float,
        /**
         * The type of distance restraint applied.
         */
        restraint_type: Aliased<'lower bound' | 'upper bound' | 'lower and upper bound'>(str),
        /**
         * The granularity of the predicted contact as applied to the multi-scale model.
         */
        model_granularity: Aliased<'by-residue' | 'by-feature'>(str),
        /**
         * Identifier to the predicted contacts dataset.
         * This data item is a pointer to the _ihm_dataset_list.id in the
         * IHM_DATASET_LIST category.
         */
        dataset_list_id: int,
        /**
         * Identifier to the software used to obtain the predicted contacts dataset.
         * This data item is a pointer to the _software.pdbx_ordinal in the
         * SOFTWARE category.
         */
        software_id: int,
    },
    /**
     * Data items in the IHM_CROSS_LINK_LIST category records the
     * list of spatial restraints derived from chemical crosslinking
     * experiment.
     */
    ihm_cross_link_list: {
        /**
         * A unique identifier for the cross link restraint.
         */
        id: int,
        /**
         * An identifier for a set of ambiguous crosslink restraints.
         * Handles experimental uncertainties in the identities of
         * crosslinked residues.
         */
        group_id: int,
        /**
         * A text description of molecular entity 1.
         */
        entity_description_1: str,
        /**
         * A text description of molecular entity 2.
         */
        entity_description_2: str,
        /**
         * The entity identifier for the first monomer partner in the cross link
         * This data item is a pointer to _entity_poly_seq.entity_id in the ENTITY_POLY_SEQ category.
         */
        entity_id_1: str,
        /**
         * The entity identifier for the second monomer partner in the cross link
         *
         * This data item is a pointer to _entity_poly_seq.entity_id in the ENTITY_POLY_SEQ category.
         */
        entity_id_2: str,
        /**
         * The component identifier for the first monomer partner in the cross link.
         *
         * This data item is a pointer to _entity_poly_seq.mon_id in the ENTITY_POLY_SEQ category.
         */
        comp_id_1: str,
        /**
         * The component identifier for the second monomer partner in the cross link.
         *
         * This data item is a pointer to _entity_poly_seq.mon_id in the ENTITY_POLY_SEQ category.
         */
        comp_id_2: str,
        /**
         * The sequence index for the first monomer partner in the cross link.
         *
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id_1: int,
        /**
         * The sequence index for the second monomer partner in the cross link.
         *
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id_2: int,
        /**
         * The type of crosslinker used.
         */
        linker_type: Aliased<'EDC' | 'DSS' | 'EGS' | 'BS3' | 'BS2G' | 'DST' | 'sulfo-SDA' | 'sulfo-SMCC' | 'DSSO' | 'DSG' | 'BSP' | 'BMSO' | 'DHSO' | 'CYS' | 'SDA' | 'DSA' | 'Other'>(str),
        /**
         * Identifier to the crosslinking dataset.
         * This data item is a pointer to the _ihm_dataset_list.id in the
         * IHM_DATASET_LIST category.
         */
        dataset_list_id: int,
    },
    /**
     * Data items in the IHM_CROSS_LINK_RESTRAINT category enumerates the
     * implementation details of the chemical crosslinking restraints in
     * the integrative modeling. This category holds the details of how
     * the experimentally derived crosslinks are applied in the modeling.
     */
    ihm_cross_link_restraint: {
        /**
         * A unique identifier for the cross link record.
         */
        id: int,
        /**
         * An identifier for a set of ambiguous cross-links.
         * Handles implementation uncertainties related to multiple copies of subunit.
         * This data item is a pointer to _ihm_cross_link_list.id in the
         * IHM_CROSS_LINK_LIST category.
         */
        group_id: int,
        /**
         * The entity identifier for the first monomer partner in the cross link
         *
         * This data item is a pointer to _entity_poly_seq.entity_id in the ENTITY_POLY_SEQ category
         * and the _ihm_cross_link_restraint.entity_id_1 in the IHM_CROSS_LINK_RESTRAINT category.
         */
        entity_id_1: str,
        /**
         * The entity identifier for the second monomer partner in the cross link
         *
         * This data item is a pointer to _entity_poly_seq.entity_id in the ENTITY_POLY_SEQ category
         * and the _ihm_cross_link_restraint.entity_id_2 in the IHM_CROSS_LINK_RESTRAINT category.
         */
        entity_id_2: str,
        /**
         * An asym/strand identifier for the first monomer partner in the cross-link.
         *
         * This data item is a pointer to _struct_asym.id in the
         * STRUCT_ASYM category.
         */
        asym_id_1: str,
        /**
         * An asym/strand identifier for the second monomer partner in the cross-link.
         *
         * This data item is a pointer to _struct_asym.id in the
         * STRUCT_ASYM category.
         */
        asym_id_2: str,
        /**
         * The component identifier for the first monomer partner in the cross link.
         *
         * This data item is a pointer to _entity_poly_seq.mon_id in the ENTITY_POLY_SEQ category
         * and the _ihm_cross_link_restraint.comp_id_1 in the IHM_CROSS_LINK_RESTRAINT category.
         */
        comp_id_1: str,
        /**
         * The component identifier for the second monomer partner in the cross link.
         *
         * This data item is a pointer to _entity_poly_seq.mon_id in the ENTITY_POLY_SEQ category
         * and the _ihm_cross_link_restraint.comp_id_2 in the IHM_CROSS_LINK_RESTRAINT category.
         */
        comp_id_2: str,
        /**
         * The sequence index for the first monomer partner in the cross link.
         *
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category
         * and the _ihm_cross_link_restraint.seq_id_1 in the IHM_CROSS_LINK_RESTRAINT category.
         */
        seq_id_1: int,
        /**
         * The sequence index for the second monomer partner in the cross link.
         *
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category
         * and the _ihm_cross_link_restraint.seq_id_2 in the IHM_CROSS_LINK_RESTRAINT category.
         */
        seq_id_2: int,
        /**
         * The atom identifier for the first monomer partner in the cross link.
         * This data item is a pointer to _chem_comp_atom.atom_id in the
         * CHEM_COMP_ATOM category.
         */
        atom_id_1: str,
        /**
         * The atom identifier for the second monomer partner in the cross link.
         * This data item is a pointer to _chem_comp_atom.atom_id in the
         * CHEM_COMP_ATOM category.
         */
        atom_id_2: str,
        /**
         * The type of the cross link restraint applied.
         */
        restraint_type: Aliased<'harmonic' | 'upper bound' | 'lower bound'>(str),
        /**
         * The cross link conditionality.
         */
        conditional_crosslink_flag: Aliased<'ALL' | 'ANY'>(str),
        /**
         * The coarse-graining information for the crosslink implementation.
         */
        model_granularity: Aliased<'by-residue' | 'by-feature' | 'by-atom'>(str),
        /**
         * The distance threshold applied to this crosslink in the integrative modeling task.
         */
        distance_threshold: float,
        /**
         * The uncertainty in the crosslinking experimental data;
         * may be approximated to the false positive rate.
         */
        psi: float,
        /**
         * The uncertainty in the position of residue 1 in the crosslink
         * arising due to the multi-scale nature of the model represention.
         */
        sigma_1: float,
        /**
         * The uncertainty in the position of residue 2 in the crosslink
         * arising due to the multi-scale nature of the model represention.
         */
        sigma_2: float,
    },
    /**
     * Data items in the IHM_CROSS_LINK_RESULT_PARAMETERS category records the
     * results of the crosslinking restraint parameters in the IHM modeling.
     */
    ihm_cross_link_result_parameters: {
        /**
         * A unique identifier for the restraint/model combination.
         */
        id: int,
        /**
         * An identifier for the crosslink restraint between a pair of residues.
         * This data item is a pointer to _ihm_cross_link_restraint.id in the
         * IHM_CROSS_LINK_RESTRAINT category.
         */
        restraint_id: int,
        /**
         * The model number corresponding to the cross link result presented.
         * This data item is a pointer to _ihm_model_list.model_id in the
         * IHM_MODEL_LIST category.
         */
        model_id: int,
        /**
         * The uncertainty in the crosslinking experimental data;
         * May be approximated to the false positive rate.
         */
        psi: float,
        /**
         * The uncertainty in the position of residue 1 in the crosslink
         * arising due to the multi-scale nature of the model represention.
         */
        sigma_1: float,
        /**
         * The uncertainty in the position of residue 2 in the crosslink
         * arising due to the multi-scale nature of the model represention.
         */
        sigma_2: float,
    },
    /**
     * Data items in the IHM_2DEM_CLASS_AVERAGE_RESTRAINT category records the
     * details of the 2DEM class averages used in the IHM modeling.
     */
    ihm_2dem_class_average_restraint: {
        /**
         * A unique identifier for the 2dem class average.
         */
        id: int,
        /**
         * Identifier to the 2dem class average dataset.
         * This data item is a pointer to the _ihm_dataset_list.id in the
         * IHM_DATASET_LIST category.
         */
        dataset_list_id: int,
        /**
         * The number of raw micrographs used to obtain the class average.
         */
        number_raw_micrographs: int,
        /**
         * Pixel size width of the 2dem class average image.
         * While fitting the model to the image, _ihm_2dem_class_average_restraint.pixel_size_width
         * is used along with _ihm_2dem_class_average_restraint.pixel_size_height to scale the image.
         */
        pixel_size_width: float,
        /**
         * Pixel size height of the 2dem class average image.
         * While fitting the model to the image, _ihm_2dem_class_average_restraint.pixel_size_height
         * is used along with _ihm_2dem_class_average_restraint.pixel_size_width to scale the image.
         */
        pixel_size_height: float,
        /**
         * Resolution of the 2dem class average.
         */
        image_resolution: float,
        /**
         * A flag that indicates whether or not the 2DEM class average image is segmented i.e.,
         * whether the whole image is used or only a portion of it is used (by masking
         * or by other means) as restraint in the modeling.
         */
        image_segment_flag: Aliased<'YES' | 'NO'>(str),
        /**
         * Number of 2D projections of the model used in the fitting.
         */
        number_of_projections: int,
        /**
         * An indicator to whether the whole assembly that is modeled is fit into the image
         * or if only a subset of the structural assembly is fit into the image.
         * This data item is a pointer to _ihm_struct_assembly.id in the
         * IHM_STRUCT_ASSEMBLY category. The IHM_STRUCT_ASSEMBLY category provides the
         * details regarding the different structural assemblies used in the modeling.
         * The default value for this data item is "1" indicating that the entire assembly
         * being modeled is fit into the EM data.
         */
        struct_assembly_id: int,
        /**
         * Details of how the 2DEM restraint is applied in the modeling algorithm.
         */
        details: str,
    },
    /**
     * Data items in the IHM_2DEM_CLASS_AVERAGE_FITTING category records the
     * details of the fitting of the model to the 2DEM class averages
     * used in the IHM modeling. The following conventions are recommended
     * while generating the rotation matrix and translation vector for
     * transformation.
     *
     * - The model is rotated and translated to fit to the 2DEM image.
     * - The 2DEM image should be in the XY plane.
     * - The lower left image corner (image pixel index 0,0) should be at x,y,z = (0,0,0).
     * - The 2D image is scaled by the _ihm_2dem_class_average_restraint.pixel_size_width
     * and _ihm_2dem_class_average_restraint.pixel_size_height from the
     * IHM_2DEM_CLASS_AVERAGE_RESTRAINT table.
     * - The transformation is applied after the scaling and hence the translation vector
     * should account for the scaling.
     * - There are no specifications for Z translations i.e., how far the image should be
     * from the model while projecting. It may be set to zero.
     */
    ihm_2dem_class_average_fitting: {
        /**
         * A unique identifier for the 2dem class average fitting data.
         */
        id: int,
        /**
         * Identifier to the 2dem class average restraint.
         * This data item is a pointer to the _ihm_2dem_class_average_restraint.id in the
         * IHM_2DEM_CLASS_AVERAGE_RESTRAINT category.
         */
        restraint_id: int,
        /**
         * The model number corresponding to the 2DEM fitting result presented.
         * This data item is a pointer to _ihm_model_list.model_id in the
         * IHM_MODEL_LIST category.
         */
        model_id: int,
        /**
         * The cross correlation coefficient corresponding to the model to image fitting.
         */
        cross_correlation_coefficient: float,
        /**
         * Data item  of the rotation matrix used in the fitting of the model to the image.
         */
        rot_matrix: Matrix(3, 3),
        /**
         * Data item  of the tranlation vector used in the fitting of the model to the image.
         */
        tr_vector: Vector(3),
    },
    /**
     * Data items in the IHM_3DEM_RESTRAINT category records the
     * details of the 3DEM maps used as restraints in the
     * IHM modeling.
     */
    ihm_3dem_restraint: {
        /**
         * A unique identifier for the 3DEM restraint description.
         */
        id: int,
        /**
         * Identifier to the 3DEM map used.
         * This data item is a pointer to the _ihm_dataset_list.id in the
         * IHM_DATASET_LIST category.
         */
        dataset_list_id: int,
        /**
         * The model number corresponding to the 3DEM fitting result presented.
         * This data item is a pointer to _ihm_model_list.model_id in the
         * IHM_MODEL_LIST category.
         */
        model_id: int,
        /**
         * An indicator to whether the whole assembly that is modeled is fit into the 3DEM map
         * or if only a subset of the structural assembly is fit into the map.
         * This data item is a pointer to _ihm_struct_assembly.id in the
         * IHM_STRUCT_ASSEMBLY category. The IHM_STRUCT_ASSEMBLY category provides the
         * details regarding the different structural assemblies used in the modeling.
         * The default value for this data item is "1" indicating that the entire assembly
         * being modeled is fit into the EM map.
         */
        struct_assembly_id: int,
        /**
         * Method used to fit the model to the 3DEM map.
         */
        fitting_method: str,
        /**
         * In case of Gaussian mixture models, the number of gaussians
         * is a parameter used to covert the 3DEM maps and models into
         * GMMs. This captures the level of granularity used in
         * representing the maps and/or models as 3D Gaussians.
         */
        number_of_gaussians: int,
        /**
         * The cross correlation coefficient corresponding to the model to map fitting.
         */
        cross_correlation_coefficient: float,
    },
    /**
     * Data items in the IHM_SAS_RESTRAINT category records the
     * details of the SAS data used as restraints in the
     * IHM modeling.
     */
    ihm_sas_restraint: {
        /**
         * A unique identifier for the SAS restraint description.
         */
        id: int,
        /**
         * Identifier to the SAS data used.
         * This data item is a pointer to the _ihm_dataset_list.id in the
         * IHM_DATASET_LIST category.
         */
        dataset_list_id: int,
        /**
         * The model number corresponding to the SAS fitting result presented.
         * This data item is a pointer to _ihm_model_list.model_id in the
         * IHM_MODEL_LIST category.
         */
        model_id: int,
        /**
         * An indicator to whether the whole assembly that is modeled is fit into the SAS data
         * or if only a subset of the structural assembly is fit into the data.
         * This data item is a pointer to _ihm_struct_assembly.id in the
         * IHM_STRUCT_ASSEMBLY category. The IHM_STRUCT_ASSEMBLY category provides the
         * details regarding the different structural assemblies used in the modeling.
         * The default value for this data item is "1" indicating that the entire assembly
         * being modeled is fit into the SAS data.
         */
        struct_assembly_id: int,
        /**
         * A flag that indicates whether or not the SAS profile is segmented i.e.,
         * whether the whole SAS profile is used or only a portion of it is used
         * (by masking or by other means) as restraint in the modeling.
         */
        profile_segment_flag: Aliased<'YES' | 'NO'>(str),
        /**
         * The type of atoms in the model fit to the SAS data.
         */
        fitting_atom_type: str,
        /**
         * The method used for fitting the model to the SAS data.
         */
        fitting_method: str,
        /**
         * An indicator to single or multiple state fitting.
         */
        fitting_state: Aliased<'Single' | 'Multiple'>(str),
        /**
         * Radius of gyration obtained from the SAS profile, if used as input restraint.
         */
        radius_of_gyration: float,
        /**
         * The chi value resulting from fitting the model to the SAS data.
         */
        chi_value: float,
        /**
         * Additional details regarding the SAS restraint used.
         */
        details: str,
    },
    /**
     * Data items in the IHM_STARTING_MODEL_COORD category records the coordinates
     * for structural templates used as starting inputs in the integrative model
     * building tasks.
     */
    ihm_starting_model_coord: {
        /**
         * A unique identifier for this coordinate position.
         */
        ordinal_id: int,
        /**
         * The identifier for the starting structural model.
         * This data item is a pointer to _ihm_starting_model_details.starting_model_id
         * in the IHM_STARTING_MODEL_DETAILS category.
         */
        starting_model_id: str,
        /**
         * The group of atoms to which the atom site in the starting model belongs. This data
         * item is provided for compatibility with the original Protein Data Bank format,
         * and only for that purpose.
         */
        group_PDB: Aliased<'ATOM' | 'HETATM'>(str),
        /**
         * The serial number for this coordinate position.
         */
        id: int,
        /**
         * The atom type symbol(element symbol) corresponding to this coordinate position.
         */
        type_symbol: str,
        /**
         * The entity identifier corresponding to this coordinate position.
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * The atom identifier/name corresponding to this coordinate position.
         * This data item is a pointer to _chem_comp_atom.atom_id in the
         * CHEM_COMP_ATOM category.
         */
        atom_id: str,
        /**
         * The component identifier corresponding to this coordinate position.
         * This data item is a pointer to _chem_comp.id in the
         * CHEM_COMP category.
         */
        comp_id: str,
        /**
         * The sequence index corresponding this to coordinate position.
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id: int,
        /**
         * The asym/strand id corresponding to this coordinate position.
         *
         * This data item is a pointer to _struct_asym.id in the STRUCT_ASYM category.
         */
        asym_id: str,
        /**
         * The Cartesian X component corresponding to this coordinate position.
         */
        Cartn_x: float,
        /**
         * The Cartesian Y component corresponding to this coordinate position.
         */
        Cartn_y: float,
        /**
         * The Cartesian Z component corresponding to this coordinate position.
         */
        Cartn_z: float,
        /**
         * The isotropic temperature factor corresponding to this coordinate position.
         */
        B_iso_or_equiv: float,
    },
    /**
     * Data items in the IHM_SPHERE_OBJ_SITE category records the details
     * of the spherical objects modeled in the integrative structural model.
     */
    ihm_sphere_obj_site: {
        /**
         * A unique identifier for this pseudo atom / sphere object.
         */
        id: int,
        /**
         * The entity identifier corresponding to this sphere object.
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * The leading sequence index corresponding to this sphere object.
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id_begin: int,
        /**
         * The trailing sequence index corresponding to this sphere object.
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id_end: int,
        /**
         * An asym/strand identifier corresponding to this sphere object.
         * This data item is a pointer to _struct_asym.id in the STRUCT_ASYM category.
         */
        asym_id: str,
        /**
         * The Cartesian X component corresponding to this sphere object.
         */
        Cartn_x: float,
        /**
         * The Cartesian Y component corresponding to this sphere object.
         */
        Cartn_y: float,
        /**
         * The Cartesian Z component corresponding to this sphere object.
         */
        Cartn_z: float,
        /**
         * The radius associated with the primitive sphere object at this position.
         */
        object_radius: float,
        /**
         * The Root Mean Square Fluctuation (RMSF) observed in the primitive
         * sphere object at this position.
         */
        rmsf: float,
        /**
         * The model id corresponding to the sphere object.
         * This data item is a pointer to _ihm_model_list.model_id
         * in the IHM_MODEL_LIST category.
         */
        model_id: int,
    },
    /**
     * Data items in the IHM_GAUSSIAN_OBJ_SITE category records the details
     * of the gaussian objects modeled in the integrative structural model.
     */
    ihm_gaussian_obj_site: {
        /**
         * A unique identifier for this gaussian object in the model.
         */
        id: int,
        /**
         * The entity identifier corresponding to this gaussian object.
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * The leading sequence index corresponding to this gaussian object.
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id_begin: int,
        /**
         * The trailing sequence index corresponding to this gaussian object.
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id_end: int,
        /**
         * An asym/strand identifier corresponding to this gaussian object.
         * This data item is a pointer to _struct_asym.id in the STRUCT_ASYM category.
         */
        asym_id: str,
        /**
         * The mean Cartesian X component corresponding to this gaussian object.
         */
        mean_Cartn_x: float,
        /**
         * The mean Cartesian Y component corresponding to this gaussian object.
         */
        mean_Cartn_y: float,
        /**
         * The mean Cartesian Z component corresponding to this gaussian object.
         */
        mean_Cartn_z: float,
        /**
         * The weight of the gaussian object.
         */
        weight: float,
        /**
         * Data item  of the covariance matrix representing the Gaussian object.
         */
        covariance_matrix: Matrix(3, 3),
        /**
         * The model id corresponding to the gaussian object.
         * This data item is a pointer to _ihm_model_list.model_id
         * in the IHM_MODEL_LIST category.
         */
        model_id: int,
    },
    /**
     * Data items in the IHM_GAUSSIAN_OBJ_ENSEMBLE category records the details
     * of the gaussian objects representing an ensemble or cluster of models.
     */
    ihm_gaussian_obj_ensemble: {
        /**
         * A unique identifier for this gaussian object.
         */
        id: int,
        /**
         * The entity identifier corresponding to this gaussian object.
         * This data item is a pointer to _entity.id in the ENTITY category.
         */
        entity_id: str,
        /**
         * The leading sequence index corresponding to this gaussian object.
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id_begin: int,
        /**
         * The trailing sequence index corresponding to this gaussian object.
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id_end: int,
        /**
         * An asym/strand identifier corresponding to this gaussian object.
         * This data item is a pointer to _struct_asym.id in the STRUCT_ASYM category.
         */
        asym_id: str,
        /**
         * The mean Cartesian X component corresponding to this gaussian object.
         */
        mean_Cartn_x: float,
        /**
         * The mean Cartesian Y component corresponding to this gaussian object.
         */
        mean_Cartn_y: float,
        /**
         * The mean Cartesian Z component corresponding to this gaussian object.
         */
        mean_Cartn_z: float,
        /**
         * The weight of the gaussian object.
         */
        weight: float,
        /**
         * Data item  of the covariance matrix representing the Gaussian object.
         */
        covariance_matrix: Matrix(3, 3),
        /**
         * The ensemble id corresponding to the gaussian object.
         * This data item is a pointer to _ihm_ensemble_info.ensemble_id
         * in the IHM_ENSEMBLE_INFO category.
         */
        ensemble_id: int,
    },
    /**
     * IHM_FEATURE_LIST is the high level category that provides defintions
     * to select atoms/residues from polymeric and non-polymeric entities.
     */
    ihm_feature_list: {
        /**
         * A unique identifier for the feature.
         */
        feature_id: int,
        /**
         * The type of feature.
         */
        feature_type: Aliased<'atom' | 'residue' | 'residue range' | 'ligand' | 'pseudo site'>(str),
        /**
         * The type of entity.
         */
        entity_type: Aliased<'polymer' | 'non-polymer' | 'water' | 'other'>(str),
    },
    /**
     * Data items in the IHM_POLY_RESIDUE_FEATURE category provides the defintions
     * required to select a specific residue or a set of residues that may or may not be
     * in a contiguous range.
     */
    ihm_poly_residue_feature: {
        /**
         * A unique identifier for the category.
         */
        ordinal_id: int,
        /**
         * An identifier for the selected residue / residue range feature.
         * This data item is a pointer to _ihm_feature_list.feature_id in the
         * IHM_FEATURE_LIST category.
         */
        feature_id: int,
        /**
         * The entity identifier for residue / residue range.
         * This data item is a pointer to _entity_poly_seq.entity_id in the
         * ENTITY_POLY_SEQ category.
         */
        entity_id: str,
        /**
         * An asym/strand identifier for the residue / residue range, if applicable.
         * This data item is a pointer to _struct_asym.id in the
         * STRUCT_ASYM category.
         */
        asym_id: str,
        /**
         * The component identifier of the beginning residue / residue range.
         * This data item is a pointer to _entity_poly_seq.mon_id in the ENTITY_POLY_SEQ category.
         */
        comp_id_begin: str,
        /**
         * The component identifier of the ending residue / residue range.
         * This data item is a pointer to _entity_poly_seq.mon_id in the ENTITY_POLY_SEQ category.
         */
        comp_id_end: str,
        /**
         * The sequence index of the beginning residue / residue range.
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id_begin: int,
        /**
         * The sequence index of the ending residue / residue range.
         * This data item is a pointer to _entity_poly_seq.num in the ENTITY_POLY_SEQ category.
         */
        seq_id_end: int,
    },
    /**
     * Data items in the IHM_DERIVED_DISTANCE_RESTRAINT category records the
     * list of distance restraints used in the integrative modeling experiment.
     * These distance redistance restraints may be derived from various kinds of experiments.
     */
    ihm_derived_distance_restraint: {
        /**
         * A unique identifier for the derived distance restraint.
         */
        id: int,
        /**
         * An identifier to group the distance restraints.
         * This can be the same as the _ihm_derived_distance_restraint.id in case
         * the some of the restraints are not grouped.
         */
        group_id: int,
        /**
         * The feature identifier for the first partner in the distance restraint.
         * This data item is a pointer to _ihm_feature_list.feature_id in the
         * IHM_FEATURE_LIST category.
         */
        feature_id_1: int,
        /**
         * The feature identifier for the second partner in the distance restraint.
         * This data item is a pointer to _ihm_feature_list.feature_id in the
         * IHM_FEATURE_LIST category.
         */
        feature_id_2: int,
        /**
         * If a group of atoms or residues are restrained, this data item defines
         * the conditionality based on which the restraint is applied in the modeling.
         */
        group_conditionality: Aliased<'ALL' | 'ANY'>(str),
        /**
         * The fraction of randomly excluded distance restraints during modeling.
         * In HADDOCK, this is used along with ambiguous interface restraints (AIRs)
         * to account for uncertainties in AIRs.
         */
        random_exclusion_fraction: float,
        /**
         * The upper limit to the distance threshold applied to this distance restraint
         * in the integrative modeling task.
         */
        distance_upper_limit: float,
        /**
         * The type of distance restraint applied.
         */
        restraint_type: Aliased<'lower bound' | 'upper bound' | 'lower and upper bound' | 'harmonic'>(str),
        /**
         * Identifier to the input data from which the distance restraint is derived.
         * This data item is a pointer to the _ihm_dataset_list.id in the
         * IHM_DATASET_LIST category.
         * This data item may not be applicable for all cases. For example, in case of
         * ambiguous interface restraints where the interface residues are identified
         * from multiple experiments, the reference to the _ihm_dataset_list.id is
         * handled in the IHM_INTERFACE_RESIDUE_FEATURE category rather than here.
         */
        dataset_list_id: int,
    },
};

export type mmCIF_Schema = typeof mmCIF_Schema;
export interface mmCIF_Database extends Database<mmCIF_Schema> {};