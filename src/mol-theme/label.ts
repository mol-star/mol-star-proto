/**
 * Copyright (c) 2018-2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @author David Sehnal <david.sehnal@gmail.com>
 */

import { Unit, StructureElement, StructureProperties as Props, Bond } from '../mol-model/structure';
import { Loci } from '../mol-model/loci';
import { OrderedSet } from '../mol-data/int';
import { capitalize, stripTags } from '../mol-util/string';
import { Column } from '../mol-data/db';
import { Vec3 } from '../mol-math/linear-algebra';
import { radToDeg } from '../mol-math/misc';
import { Volume } from '../mol-model/volume';

export type LabelGranularity = 'element' | 'conformation' | 'residue' | 'chain' | 'structure'

export const DefaultLabelOptions = {
    granularity: 'element' as LabelGranularity,
    condensed: false,
    reverse: false,
    countsOnly: false,
    hidePrefix: false,
    htmlStyling: true,
};
export type LabelOptions = typeof DefaultLabelOptions

export function lociLabel(loci: Loci, options: Partial<LabelOptions> = {}): string {
    switch (loci.kind) {
        case 'structure-loci':
            return loci.structure.models.map(m => m.entry).filter(l => !!l).join(', ');
        case 'element-loci':
            return structureElementStatsLabel(StructureElement.Stats.ofLoci(loci), options);
        case 'bond-loci':
            const bond = loci.bonds[0];
            return bond ? bondLabel(bond) : '';
        case 'shape-loci':
            return loci.shape.name;
        case 'group-loci':
            const g = loci.groups[0];
            return g ? loci.shape.getLabel(OrderedSet.start(g.ids), g.instance) : '';
        case 'every-loci':
            return 'Everything';
        case 'empty-loci':
            return 'Nothing';
        case 'data-loci':
            return loci.getLabel();
        case 'volume-loci':
            return loci.volume.label || 'Volume';
        case 'isosurface-loci':
            return [
                `${loci.volume.label || 'Volume'}`,
                `Isosurface at ${Volume.IsoValue.toString(loci.isoValue)}`
            ].join(' | ');
        case 'cell-loci':
            const size = OrderedSet.size(loci.indices);
            const start = OrderedSet.start(loci.indices);
            const absVal = Volume.IsoValue.absolute(loci.volume.grid.cells.data[start]);
            const relVal = Volume.IsoValue.toRelative(absVal, loci.volume.grid.stats);
            const label = [
                `${loci.volume.label || 'Volume'}`,
                `${size === 1 ? `Cell #${start}` : `${size} Cells`}`
            ];
            if (size === 1) {
                label.push(`${Volume.IsoValue.toString(absVal)} (${Volume.IsoValue.toString(relVal)})`);
            }
            return label.join(' | ');
    }
}

function countLabel(count: number, label: string) {
    return count === 1 ? `1 ${label}` : `${count} ${label}s`;
}

function otherLabel(count: number, location: StructureElement.Location, granularity: LabelGranularity, hidePrefix: boolean, reverse: boolean, condensed: boolean) {
    return `${elementLabel(location, { granularity, hidePrefix, reverse, condensed })} <small>[+ ${countLabel(count - 1, `other ${capitalize(granularity)}`)}]</small>`;
}

/** Gets residue count of the model chain segments the unit is a subset of */
function getResidueCount(unit: Unit.Atomic) {
    const { elements, model } = unit;
    const { chainAtomSegments, residueAtomSegments } = model.atomicHierarchy;
    const elementStart = chainAtomSegments.offsets[chainAtomSegments.index[elements[0]]];
    const elementEnd = chainAtomSegments.offsets[chainAtomSegments.index[elements[elements.length - 1]] + 1] - 1;
    return residueAtomSegments.index[elementEnd] - residueAtomSegments.index[elementStart] + 1;
}

export function structureElementStatsLabel(stats: StructureElement.Stats, options: Partial<LabelOptions> = {}): string {
    const o = { ...DefaultLabelOptions, ...options };
    const label = _structureElementStatsLabel(stats, o.countsOnly, o.hidePrefix, o.condensed, o.reverse);
    return o.htmlStyling ? label : stripTags(label);
}

function _structureElementStatsLabel(stats: StructureElement.Stats, countsOnly = false, hidePrefix = false, condensed = false, reverse = false): string {
    const { structureCount, chainCount, residueCount, conformationCount, elementCount } = stats;

    if (!countsOnly && elementCount === 1 && residueCount === 0 && chainCount === 0) {
        return elementLabel(stats.firstElementLoc, { hidePrefix, condensed, granularity: 'element', reverse });
    } else if (!countsOnly && elementCount === 0 && residueCount === 1 && chainCount === 0) {
        return elementLabel(stats.firstResidueLoc, { hidePrefix, condensed, granularity: 'residue', reverse });
    } else if (!countsOnly && elementCount === 0 && residueCount === 0 && chainCount === 1) {
        const { unit } = stats.firstChainLoc;
        const granularity = (Unit.isAtomic(unit) && getResidueCount(unit) === 1)
            ? 'residue' : Unit.Traits.is(unit.traits, Unit.Trait.MultiChain)
                ? 'residue' : 'chain';
        return elementLabel(stats.firstChainLoc, { hidePrefix, condensed, granularity, reverse });
    } else if (!countsOnly) {
        const label: string[] = [];
        if (structureCount > 0) {
            label.push(structureCount === 1 ? elementLabel(stats.firstStructureLoc, { hidePrefix, condensed, granularity: 'structure', reverse }) : otherLabel(structureCount, stats.firstStructureLoc, 'structure', hidePrefix, reverse, condensed));
        }
        if (chainCount > 0) {
            label.push(chainCount === 1 ? elementLabel(stats.firstChainLoc, { condensed, granularity: 'chain', hidePrefix, reverse }) : otherLabel(chainCount, stats.firstChainLoc, 'chain', hidePrefix, reverse, condensed));
            hidePrefix = true;
        }
        if (residueCount > 0) {
            label.push(residueCount === 1 ? elementLabel(stats.firstResidueLoc, { condensed, granularity: 'residue', hidePrefix, reverse }) : otherLabel(residueCount, stats.firstResidueLoc, 'residue', hidePrefix, reverse, condensed));
            hidePrefix = true;
        }
        if (conformationCount > 0) {
            label.push(conformationCount === 1 ? elementLabel(stats.firstConformationLoc, { condensed, granularity: 'conformation', hidePrefix, reverse }) : otherLabel(conformationCount, stats.firstConformationLoc, 'conformation', hidePrefix, reverse, condensed));
            hidePrefix = true;
        }
        if (elementCount > 0) {
            label.push(elementCount === 1 ? elementLabel(stats.firstElementLoc, { condensed, granularity: 'element', hidePrefix, reverse }) : otherLabel(elementCount, stats.firstElementLoc, 'element', hidePrefix, reverse, condensed));
        }
        return label.join('<small> + </small>');
    } else {
        const label: string[] = [];
        if (structureCount > 0) label.push(countLabel(structureCount, 'Structure'));
        if (chainCount > 0) label.push(countLabel(chainCount, 'Chain'));
        if (residueCount > 0) label.push(countLabel(residueCount, 'Residue'));
        if (conformationCount > 0) label.push(countLabel(conformationCount, 'Conformation'));
        if (elementCount > 0) label.push(countLabel(elementCount, 'Element'));
        return label.join('<small> + </small>');
    }
}

export function bondLabel(bond: Bond.Location, options: Partial<LabelOptions> = {}): string {
    return bundleLabel({ loci: [
        StructureElement.Loci(bond.aStructure, [{ unit: bond.aUnit, indices: OrderedSet.ofSingleton(bond.aIndex) }]),
        StructureElement.Loci(bond.bStructure, [{ unit: bond.bUnit, indices: OrderedSet.ofSingleton(bond.bIndex) }])
    ]}, options);
}

export function bundleLabel(bundle: Loci.Bundle<any>, options: Partial<LabelOptions> = {}): string {
    const o = { ...DefaultLabelOptions, ...options };
    const label = _bundleLabel(bundle, o);
    return o.htmlStyling ? label : stripTags(label);
}

export function _bundleLabel(bundle: Loci.Bundle<any>, options: LabelOptions) {
    const { granularity, hidePrefix, reverse, condensed } = options;

    let isSingleElements = true;
    for (const l of bundle.loci) {
        if (!StructureElement.Loci.is(l) || StructureElement.Loci.size(l) !== 1) {
            isSingleElements = false;
            break;
        }
    }

    if (isSingleElements) {
        const locations = (bundle.loci as StructureElement.Loci[]).map(l => {
            const { unit, indices } = l.elements[0];
            return StructureElement.Location.create(l.structure, unit, unit.elements[OrderedSet.start(indices)]);
        });
        const labels = locations.map(l => _elementLabel(l, granularity, hidePrefix, reverse || condensed));

        if (condensed) {
            return labels.map(l => l[0].replace(/\[.*\]/g, '').trim()).filter(l => !!l).join(' \u2014 ');
        }

        let offset = 0;
        for (let i = 0, il = Math.min(...labels.map(l => l.length)) - 1; i < il; ++i) {
            let areIdentical = true;
            for (let j = 1, jl = labels.length; j < jl; ++j) {
                if (labels[0][i] !== labels[j][i]) {
                    areIdentical = false;
                    break;
                }
            }
            if (areIdentical) offset += 1;
            else break;
        }

        if (offset > 0) {
            const offsetLabels = [labels[0].join(' | ')];
            for (let j = 1, jl = labels.length; j < jl; ++j) {
                offsetLabels.push(labels[j].slice(offset).filter(l => !!l).join(' | '));
            }
            return offsetLabels.join(' \u2014 ');
        } else {
            return labels.map(l => l.filter(l => !!l).join(' | ')).filter(l => !!l).join('</br>');
        }
    } else {
        const labels = bundle.loci.map(l => lociLabel(l, options));
        return labels.filter(l => !!l).join(condensed ? ' \u2014 ' : '</br>');
    }
}

export function elementLabel(location: StructureElement.Location, options: Partial<LabelOptions> = {}): string {
    const o = { ...DefaultLabelOptions, ...options };
    const _label = _elementLabel(location, o.granularity, o.hidePrefix, o.reverse || o.condensed);
    // TODO: condensed label for single atom structure returns empty label.. handle this case here?
    const label = o.condensed ? _label[0]?.replace(/\[.*\]/g, '').trim() ?? '' : _label.filter(l => !!l).join(' | ');
    return o.htmlStyling ? label : stripTags(label);
}

function _elementLabel(location: StructureElement.Location, granularity: LabelGranularity = 'element', hidePrefix = false, reverse = false): string[] {
    const label: string[] = [];
    if (!hidePrefix) {
        let entry = location.unit.model.entry;
        if (entry.length > 30) entry = entry.substr(0, 27) + '\u2026'; // ellipsis
        label.push(`<small>${entry}</small>`); // entry
        if (granularity !== 'structure') {
            label.push(`<small>Model ${location.unit.model.modelNum}</small>`); // model
            label.push(`<small>Instance ${location.unit.conformation.operator.name}</small>`); // instance
        }
    }

    if (Unit.isAtomic(location.unit)) {
        label.push(..._atomicElementLabel(location as StructureElement.Location<Unit.Atomic>, granularity, reverse));
    } else if (Unit.isCoarse(location.unit)) {
        label.push(..._coarseElementLabel(location as StructureElement.Location<Unit.Spheres | Unit.Gaussians>, granularity));
    } else {
        label.push('Unknown');
    }

    return reverse ? label.reverse() : label;
}

function _atomicElementLabel(location: StructureElement.Location<Unit.Atomic>, granularity: LabelGranularity, hideOccupancy = false): string[] {
    const rI = StructureElement.Location.residueIndex(location);

    const label_asym_id = Props.chain.label_asym_id(location);
    const auth_asym_id = Props.chain.auth_asym_id(location);
    const has_label_seq_id = location.unit.model.atomicHierarchy.residues.label_seq_id.valueKind(rI) === Column.ValueKind.Present;
    const label_seq_id = Props.residue.label_seq_id(location);
    const auth_seq_id = Props.residue.auth_seq_id(location);
    const ins_code = Props.residue.pdbx_PDB_ins_code(location);
    const comp_id = Props.atom.label_comp_id(location);
    const atom_id = Props.atom.label_atom_id(location);
    const alt_id = Props.atom.label_alt_id(location);
    const occupancy = Props.atom.occupancy(location);

    const microHetCompIds = Props.residue.microheterogeneityCompIds(location);
    const compId = granularity === 'residue' && microHetCompIds.length > 1 ?
        `(${microHetCompIds.join('|')})` : comp_id;

    const label: string[] = [];

    switch (granularity) {
        case 'element':
            label.push(`<b>${atom_id}</b>${alt_id ? `%${alt_id}` : ''}`);
        case 'conformation':
            if (granularity === 'conformation' && alt_id) {
                label.push(`<small>Conformation</small> <b>${alt_id}</b>`);
            }
        case 'residue':
            const seq_id = label_seq_id.toString() === auth_seq_id || !has_label_seq_id ? auth_seq_id : label_seq_id;
            label.push(`<b>${compId} ${seq_id}</b>${seq_id !== auth_seq_id ? ` <small>[auth</small> <b>${auth_seq_id}</b><small>]</small>` : ''}<b>${ins_code ? ins_code : ''}</b>`);
        case 'chain':
            if (label_asym_id === auth_asym_id) {
                label.push(`<b>${label_asym_id}</b>`);
            } else {
                if (granularity === 'chain' && Unit.Traits.is(location.unit.traits, Unit.Trait.MultiChain)) {
                    label.push(`<small>[auth</small> <b>${auth_asym_id}</b><small>]</small>`);
                } else {
                    label.push(`<b>${label_asym_id}</b> <small>[auth</small> <b>${auth_asym_id}</b><small>]</small>`);
                }
            }
    }

    if (label.length > 0 && occupancy !== 1 && !hideOccupancy) {
        label[0] = `${label[0]} <small>[occupancy</small> <b>${Math.round(100 * occupancy) / 100}</b><small>]</small>`;
    }

    return label.reverse();
}

function _coarseElementLabel(location: StructureElement.Location<Unit.Spheres | Unit.Gaussians>, granularity: LabelGranularity): string[] {
    const asym_id = Props.coarse.asym_id(location);
    const seq_id_begin = Props.coarse.seq_id_begin(location);
    const seq_id_end = Props.coarse.seq_id_end(location);

    const label: string[] = [];

    switch (granularity) {
        case 'element':
        case 'conformation':
        case 'residue':
            if (seq_id_begin === seq_id_end) {
                const entityIndex = Props.coarse.entityKey(location);
                const seq = location.unit.model.sequence.byEntityKey[entityIndex];
                const comp_id = seq.sequence.compId.value(seq_id_begin - 1); // 1-indexed
                label.push(`<b>${comp_id} ${seq_id_begin}</b>`);
            } else {
                label.push(`<b>${seq_id_begin}-${seq_id_end}</b>`);
            }
        case 'chain':
            label.push(`<b>${asym_id}</b>`);
    }

    return label.reverse();
}

//

export function distanceLabel(pair: Loci.Bundle<2>, options: Partial<LabelOptions & { measureOnly: boolean, unitLabel: string }> = {}) {
    const o = { ...DefaultLabelOptions, measureOnly: false, unitLabel: '\u212B', ...options };
    const [cA, cB] = pair.loci.map(l => Loci.getCenter(l)!);
    const distance = `${Vec3.distance(cA, cB).toFixed(2)} ${o.unitLabel}`;
    if (o.measureOnly) return distance;
    const label = bundleLabel(pair, o);
    return o.condensed ? `${distance} | ${label}` : `Distance ${distance}</br>${label}`;
}

export function angleLabel(triple: Loci.Bundle<3>, options: Partial<LabelOptions & { measureOnly: boolean }> = {}) {
    const o = { ...DefaultLabelOptions, measureOnly: false, ...options };
    const [cA, cB, cC] = triple.loci.map(l => Loci.getCenter(l)!);
    const vAB = Vec3.sub(Vec3(), cA, cB);
    const vCB = Vec3.sub(Vec3(), cC, cB);
    const angle = `${radToDeg(Vec3.angle(vAB, vCB)).toFixed(2)}\u00B0`;
    if (o.measureOnly) return angle;
    const label = bundleLabel(triple, o);
    return o.condensed ? `${angle} | ${label}` : `Angle ${angle}</br>${label}`;
}

export function dihedralLabel(quad: Loci.Bundle<4>, options: Partial<LabelOptions & { measureOnly: boolean }> = {}) {
    const o = { ...DefaultLabelOptions, measureOnly: false, ...options };
    const [cA, cB, cC, cD] = quad.loci.map(l => Loci.getCenter(l)!);
    const dihedral = `${radToDeg(Vec3.dihedralAngle(cA, cB, cC, cD)).toFixed(2)}\u00B0`;
    if (o.measureOnly) return dihedral;
    const label = bundleLabel(quad, o);
    return o.condensed ? `${dihedral} | ${label}` : `Dihedral ${dihedral}</br>${label}`;
}