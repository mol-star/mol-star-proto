/**
 * Copyright (c) 2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Sebastian Bittrich <sebastian.bittrich@rcsb.org>
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { Structure, StructureElement, StructureProperties, Unit } from '../../mol-model/structure';
import { Task, RuntimeContext } from '../../mol-task';
import { CentroidHelper } from '../../mol-math/geometry/centroid-helper';
import { AccessibleSurfaceAreaParams } from '../../mol-model-props/computed/accessible-surface-area';
import { Vec3 } from '../../mol-math/linear-algebra';
import { getElementMoleculeType } from '../../mol-model/structure/util';
import { MoleculeType } from '../../mol-model/structure/model/types';
import { AccessibleSurfaceArea } from '../../mol-model-props/computed/accessible-surface-area/shrake-rupley';
import { ParamDefinition as PD } from '../../mol-util/param-definition';
import { MembraneOrientation } from './prop';

const LARGE_CA_THRESHOLD = 5000;
const DEFAULT_UPDATE_INTERVAL = 10;
const LARGE_CA_UPDATE_INTERVAL = 1;

interface ANVILContext {
    structure: Structure,

    numberOfSpherePoints: number,
    stepSize: number,
    minThickness: number,
    maxThickness: number,
    asaCutoff: number,
    adjust: number,

    offsets: ArrayLike<number>,
    exposed: ArrayLike<number>,
    hydrophobic: ArrayLike<boolean>,
    centroid: Vec3,
    extent: number,
    large: boolean
};

export const ANVILParams = {
    numberOfSpherePoints: PD.Numeric(140, { min: 35, max: 700, step: 1 }, { description: 'Number of spheres/directions to test for membrane placement. Original value is 350.' }),
    stepSize: PD.Numeric(1, { min: 0.25, max: 4, step: 0.25 }, { description: 'Thickness of membrane slices that will be tested' }),
    minThickness: PD.Numeric(20, { min: 10, max: 30, step: 1}, { description: 'Minimum membrane thickness used during refinement' }),
    maxThickness: PD.Numeric(40, { min: 30, max: 50, step: 1}, { description: 'Maximum membrane thickness used during refinement' }),
    asaCutoff: PD.Numeric(40, { min: 10, max: 100, step: 1 }, { description: 'Relative ASA cutoff above which residues will be considered' }),
    adjust: PD.Numeric(14, { min: 0, max: 30, step: 1 }, { description: 'Minimum length of membrane-spanning regions (original values: 14 for alpha-helices and 5 for beta sheets). Set to 0 to not optimize membrane thickness.' })
};
export type ANVILParams = typeof ANVILParams
export type ANVILProps = PD.Values<ANVILParams>

/**
 * Implements:
 * Membrane positioning for high- and low-resolution protein structures through a binary classification approach
 * Guillaume Postic, Yassine Ghouzam, Vincent Guiraud, and Jean-Christophe Gelly
 * Protein Engineering, Design & Selection, 2015, 1–5
 * doi: 10.1093/protein/gzv063
 */
export function computeANVIL(structure: Structure, props: ANVILProps) {
    return Task.create('Compute Membrane Orientation', async runtime => {
        return await calculate(runtime, structure, props);
    });
}

// avoiding namespace lookup improved performance in Chrome (Aug 2020)
const v3add = Vec3.add;
const v3clone = Vec3.clone;
const v3create = Vec3.create;
const v3distance = Vec3.distance;
const v3dot = Vec3.dot;
const v3magnitude = Vec3.magnitude;
const v3normalize = Vec3.normalize;
const v3scale = Vec3.scale;
const v3scaleAndAdd = Vec3.scaleAndAdd;
const v3set = Vec3.set;
const v3squaredDistance = Vec3.squaredDistance;
const v3sub = Vec3.sub;
const v3zero = Vec3.zero;

const centroidHelper = new CentroidHelper();
async function initialize(structure: Structure, props: ANVILProps, accessibleSurfaceArea: AccessibleSurfaceArea): Promise<ANVILContext> {
    const l = StructureElement.Location.create(structure);
    const { label_atom_id, label_comp_id, x, y, z } = StructureProperties.atom;
    const asaCutoff = props.asaCutoff / 100;
    centroidHelper.reset();

    const offsets = new Array<number>();
    const exposed = new Array<number>();
    const hydrophobic = new Array<boolean>();

    const vec = v3zero();
    for (let i = 0, il = structure.units.length; i < il; ++i) {
        const unit = structure.units[i];
        const { elements } = unit;
        l.unit = unit;

        for (let j = 0, jl = elements.length; j < jl; ++j) {
            const eI = elements[j];
            l.element = eI;

            // consider only amino acids
            if (getElementMoleculeType(unit, eI) !== MoleculeType.Protein) {
                continue;
            }

            // only CA is considered for downstream operations
            if (label_atom_id(l) !== 'CA' && label_atom_id(l) !== 'BB') {
                continue;
            }

            // original ANVIL only considers canonical amino acids
            if (!MaxAsa[label_comp_id(l)]) {
                continue;
            }

            // while iterating use first pass to compute centroid
            v3set(vec, x(l), y(l), z(l));
            centroidHelper.includeStep(vec);

            // keep track of offsets and exposed state to reuse
            offsets.push(structure.serialMapping.getSerialIndex(l.unit, l.element));
            if (AccessibleSurfaceArea.getValue(l, accessibleSurfaceArea) / MaxAsa[label_comp_id(l)] > asaCutoff) {
                exposed.push(structure.serialMapping.getSerialIndex(l.unit, l.element));
                hydrophobic.push(isHydrophobic(label_comp_id(l)));
            }
        }
    }

    // calculate centroid and extent
    centroidHelper.finishedIncludeStep();
    const centroid = v3clone(centroidHelper.center);
    for (let k = 0, kl = offsets.length; k < kl; k++) {
        setLocation(l, structure, offsets[k]);
        v3set(vec, x(l), y(l), z(l));
        centroidHelper.radiusStep(vec);
    }
    const extent = 1.2 * Math.sqrt(centroidHelper.radiusSq);

    return {
        ...props,
        structure,

        offsets,
        exposed,
        hydrophobic,
        centroid,
        extent,
        large: offsets.length > LARGE_CA_THRESHOLD
    };
}

export async function calculate(runtime: RuntimeContext, structure: Structure, params: ANVILProps): Promise<MembraneOrientation> {
    // can't get away with the default 92 points here
    const asaProps = { ...PD.getDefaultValues(AccessibleSurfaceAreaParams), probeSize: 4.0, traceOnly: true, numberOfSpherePoints: 184 };
    const accessibleSurfaceArea = await AccessibleSurfaceArea.compute(structure, asaProps).runInContext(runtime);

    const ctx = await initialize(structure, params, accessibleSurfaceArea);
    const initialHphobHphil = HphobHphil.initial(ctx);

    const initialMembrane = (await findMembrane(runtime, 'Placing initial membrane...', ctx, generateSpherePoints(ctx, ctx.numberOfSpherePoints), initialHphobHphil))!;
    const refinedMembrane = (await findMembrane(runtime, 'Refining membrane placement...', ctx, findProximateAxes(ctx, initialMembrane), initialHphobHphil))!;
    let membrane = initialMembrane.qmax! > refinedMembrane.qmax! ? initialMembrane : refinedMembrane;

    if (ctx.adjust && !ctx.large) {
        membrane = await adjustThickness(runtime, 'Adjusting membrane thickness...', ctx, membrane, initialHphobHphil);
    }

    const normalVector = v3zero();
    const center =  v3zero();
    v3sub(normalVector, membrane.planePoint1, membrane.planePoint2);
    v3normalize(normalVector, normalVector);

    v3add(center, membrane.planePoint1, membrane.planePoint2);
    v3scale(center, center, 0.5);
    const extent = adjustExtent(ctx, membrane, center);

    return {
        planePoint1: membrane.planePoint1,
        planePoint2: membrane.planePoint2,
        normalVector,
        centroid: center,
        radius: extent
    };
}

interface MembraneCandidate {
    planePoint1: Vec3,
    planePoint2: Vec3,
    stats: HphobHphil,
    normalVector?: Vec3,
    spherePoint?: Vec3,
    qmax?: number
}

namespace MembraneCandidate {
    export function initial(c1: Vec3, c2: Vec3, stats: HphobHphil): MembraneCandidate {
        return {
            planePoint1: c1,
            planePoint2: c2,
            stats
        };
    }

    export function scored(spherePoint: Vec3, planePoint1: Vec3, planePoint2: Vec3, stats: HphobHphil, qmax: number, centroid: Vec3): MembraneCandidate {
        const normalVector = v3zero();
        v3sub(normalVector, centroid, spherePoint);
        return {
            planePoint1,
            planePoint2,
            stats,
            normalVector,
            spherePoint,
            qmax
        };
    }
}

async function findMembrane(runtime: RuntimeContext, message: string | undefined, ctx: ANVILContext, spherePoints: Vec3[], initialStats: HphobHphil): Promise<MembraneCandidate | undefined> {
    const { centroid, stepSize, minThickness, maxThickness, large } = ctx;
    // best performing membrane
    let membrane: MembraneCandidate | undefined;
    // score of the best performing membrane
    let qmax = 0;

    // construct slices of thickness 1.0 along the axis connecting the centroid and the spherePoint
    const diam = v3zero();
    for (let n = 0, nl = spherePoints.length; n < nl; n++) {
        if (runtime.shouldUpdate && message && (n + 1) % (large ? LARGE_CA_UPDATE_INTERVAL : DEFAULT_UPDATE_INTERVAL) === 0) {
            await runtime.update({ message, current: (n + 1), max: nl });
        }

        const spherePoint = spherePoints[n];
        v3sub(diam, centroid, spherePoint);
        v3scale(diam, diam, 2);
        const diamNorm = v3magnitude(diam);

        const sliceStats = HphobHphil.sliced(ctx, stepSize, spherePoint, diam, diamNorm);
        const qvartemp = [];
        for (let i = 0, il = diamNorm - stepSize; i < il; i += stepSize) {
            const c1 = v3zero();
            const c2 = v3zero();
            v3scaleAndAdd(c1, spherePoint, diam, i / diamNorm);
            v3scaleAndAdd(c2, spherePoint, diam, (i + stepSize) / diamNorm);

            // evaluate how well this membrane slice embeddeds the peculiar residues
            const stats = sliceStats[Math.round(i / stepSize)];
            qvartemp.push(MembraneCandidate.initial(c1, c2, stats));
        }

        let jmax = Math.floor((minThickness / stepSize) - 1);

        for (let width = 0, widthl = maxThickness; width <= widthl;) {
            for (let i = 0, il = qvartemp.length - 1 - jmax; i < il; i++) {
                let hphob = 0;
                let hphil = 0;
                for (let j = 0; j < jmax; j++) {
                    const ij = qvartemp[i + j];
                    if (j === 0 || j === jmax - 1) {
                        hphob += Math.floor(0.5 * ij.stats.hphob);
                        hphil += 0.5 * ij.stats.hphil;
                    } else {
                        hphob += ij.stats.hphob;
                        hphil += ij.stats.hphil;
                    }
                }

                if (hphob !== 0) {
                    const stats = { hphob, hphil };
                    const qvaltest = qValue(stats, initialStats);
                    if (qvaltest >= qmax) {
                        qmax = qvaltest;
                        membrane = MembraneCandidate.scored(spherePoint, qvartemp[i].planePoint1, qvartemp[i + jmax].planePoint2, stats, qmax, centroid);
                    }
                }
            }
            jmax++;
            width = (jmax + 1) * stepSize;
        }
    }

    return membrane;
}

/** Adjust membrane thickness by maximizing the number of membrane segments. */
async function adjustThickness(runtime: RuntimeContext, message: string | undefined, ctx: ANVILContext, membrane: MembraneCandidate, initialHphobHphil: HphobHphil): Promise<MembraneCandidate> {
    const { minThickness, large } = ctx;
    const step = 0.3;
    let maxThickness = v3distance(membrane.planePoint1, membrane.planePoint2);

    let maxNos = membraneSegments(ctx, membrane).length;
    let optimalThickness = membrane;

    let n = 0;
    const nl = Math.ceil((maxThickness - minThickness) / step);
    while (maxThickness > minThickness) {
        n++;
        if (runtime.shouldUpdate && message && n % (large ? LARGE_CA_UPDATE_INTERVAL : DEFAULT_UPDATE_INTERVAL) === 0) {
            await runtime.update({ message, current: n, max: nl });
        }

        const p = {
            ...ctx,
            maxThickness,
            stepSize: step
        };
        const temp = await findMembrane(runtime, void 0, p, [membrane.spherePoint!], initialHphobHphil);
        if (temp) {
            const nos = membraneSegments(ctx, temp).length;
            if (nos > maxNos) {
                maxNos = nos;
                optimalThickness = temp;
            }
        }
        maxThickness -= step;
    }

    return optimalThickness;
}

/** Report auth_seq_ids for all transmembrane segments. Will reject segments that are shorter than the adjust parameter specifies. Missing residues are considered in-membrane. */
function membraneSegments(ctx: ANVILContext, membrane: MembraneCandidate): ArrayLike<{ start: number, end: number }> {
    const { offsets, structure, adjust } = ctx;
    const { normalVector, planePoint1, planePoint2 } = membrane;
    const { units } = structure;
    const { elementIndices, unitIndices } = structure.serialMapping;
    const testPoint = v3zero();
    const { label_seq_id } = StructureProperties.residue;

    const d1 = -v3dot(normalVector!, planePoint1);
    const d2 = -v3dot(normalVector!, planePoint2);
    const dMin = Math.min(d1, d2);
    const dMax = Math.max(d1, d2);

    const inMembrane: { [k: string]: Set<number> } = Object.create(null);
    const outMembrane: { [k: string]: Set<number> } = Object.create(null);
    const segments: Array<{ start: number, end: number }> = [];
    let labelAsymId;
    let lastLabelAsymId = null;
    let labelSeqId;
    let lastLabelSeqId = units[0].model.atomicHierarchy.residues.label_seq_id.value((units[0] as Unit.Atomic).chainIndex[0]) - 1;
    let startOffset = 0;
    let endOffset = 0;

    // collect all residues in membrane layer
    for (let k = 0, kl = offsets.length; k < kl; k++) {
        const unit = units[unitIndices[offsets[k]]];
        if (!Unit.isAtomic(unit)) throw 'Property only available for atomic models.';
        const elementIndex = elementIndices[offsets[k]];

        labelAsymId = unit.model.atomicHierarchy.chains.label_asym_id.value(unit.chainIndex[elementIndex]);
        if (labelAsymId !== lastLabelAsymId) {
            if (!inMembrane[labelAsymId]) inMembrane[labelAsymId] = new Set<number>();
            if (!outMembrane[labelAsymId]) outMembrane[labelAsymId] = new Set<number>();
            lastLabelAsymId = labelAsymId;
        }

        labelSeqId = unit.model.atomicHierarchy.residues.label_seq_id.value(unit.residueIndex[elementIndex]);
        v3set(testPoint, unit.conformation.x(elementIndex), unit.conformation.y(elementIndex), unit.conformation.z(elementIndex));
        if (_isInMembranePlane(testPoint, normalVector!, dMin, dMax)) {
            inMembrane[labelAsymId].add(labelSeqId);
        } else {
            outMembrane[labelAsymId].add(labelSeqId);
        }
    }

    for (let k = 0, kl = offsets.length; k < kl; k++) {
        const unit = units[unitIndices[offsets[k]]];
        if (!Unit.isAtomic(unit)) throw 'Property only available for atomic models.';
        const elementIndex = elementIndices[offsets[k]];

        labelAsymId = unit.model.atomicHierarchy.chains.label_asym_id.value(unit.chainIndex[elementIndex]);
        labelSeqId = unit.model.atomicHierarchy.residues.label_seq_id.value(unit.residueIndex[elementIndex]);
        if (inMembrane[labelAsymId].has(labelSeqId)) {
            // chain change
            if (labelAsymId !== lastLabelAsymId) {
                segments.push({ start: startOffset, end: endOffset });
                lastLabelAsymId = labelAsymId;
                startOffset = k;
                endOffset = k;
            }

            // sequence gaps
            if (labelSeqId !== lastLabelSeqId + 1) {
                if (outMembrane[labelAsymId].has(lastLabelSeqId + 1)) {
                    segments.push({ start: startOffset, end: endOffset });
                    startOffset = k;
                }
                lastLabelSeqId = labelSeqId;
                endOffset = k;
            } else  {
                lastLabelSeqId++;
                endOffset++;
            }
        }
    }
    segments.push({ start: startOffset, end: endOffset });

    const l = StructureElement.Location.create(structure);
    let startLabel;
    let endLabel;
    const refinedSegments: Array<{ start: number, end: number }> = [];
    for (let k = 0, kl = segments.length; k < kl; k++) {
        const { start, end } = segments[k];
        if (start === 0 || end === offsets.length - 1) continue;

        // evaluate residues 1 pos outside of membrane
        setLocation(l, structure, offsets[start - 1]);
        v3set(testPoint, l.unit.conformation.x(l.element), l.unit.conformation.y(l.element), l.unit.conformation.z(l.element));
        const d3 = -v3dot(normalVector!, testPoint);

        setLocation(l, structure, offsets[end + 1]);
        v3set(testPoint, l.unit.conformation.x(l.element), l.unit.conformation.y(l.element), l.unit.conformation.z(l.element));
        const d4 = -v3dot(normalVector!, testPoint);

        if (Math.min(d3, d4) < dMin && Math.max(d3, d4) > dMax) {
            // reject this refinement
            setLocation(l, structure, offsets[start]);
            startLabel = label_seq_id(l);
            setLocation(l, structure, offsets[end]);
            endLabel = label_seq_id(l);
            if (Math.abs(startLabel - endLabel) + 1 < adjust) {
                return [];
            }
            refinedSegments.push(segments[k]);
        }
    }

    return refinedSegments;
}

/** Filter for membrane residues and calculate the final extent of the membrane layer */
function adjustExtent(ctx: ANVILContext, membrane: MembraneCandidate, centroid: Vec3): number {
    const { offsets, structure } = ctx;
    const { normalVector, planePoint1, planePoint2 } = membrane;
    const l = StructureElement.Location.create(structure);
    const testPoint = v3zero();
    const { x, y, z } = StructureProperties.atom;

    const d1 = -v3dot(normalVector!, planePoint1);
    const d2 = -v3dot(normalVector!, planePoint2);
    const dMin = Math.min(d1, d2);
    const dMax = Math.max(d1, d2);
    let extent = 0;

    for (let k = 0, kl = offsets.length; k < kl; k++) {
        setLocation(l, structure, offsets[k]);
        v3set(testPoint, x(l), y(l), z(l));
        if (_isInMembranePlane(testPoint, normalVector!, dMin, dMax)) {
            const dsq = v3squaredDistance(testPoint, centroid);
            if (dsq > extent) extent = dsq;
        }
    }

    return Math.sqrt(extent);
}

function qValue(currentStats: HphobHphil, initialStats: HphobHphil): number {
    if(initialStats.hphob < 1) {
        initialStats.hphob = 0.1;
    }

    if(initialStats.hphil < 1) {
        initialStats.hphil += 1;
    }

    const part_tot = currentStats.hphob + currentStats.hphil;
    return (currentStats.hphob * (initialStats.hphil - currentStats.hphil) - currentStats.hphil * (initialStats.hphob - currentStats.hphob)) /
            Math.sqrt(part_tot * initialStats.hphob * initialStats.hphil * (initialStats.hphob + initialStats.hphil - part_tot));
}

export function isInMembranePlane(testPoint: Vec3, normalVector: Vec3, planePoint1: Vec3, planePoint2: Vec3): boolean {
    const d1 = -v3dot(normalVector, planePoint1);
    const d2 = -v3dot(normalVector, planePoint2);
    return _isInMembranePlane(testPoint, normalVector, Math.min(d1, d2), Math.max(d1, d2));
}

function _isInMembranePlane(testPoint: Vec3, normalVector: Vec3, min: number, max: number): boolean {
    const d = -v3dot(normalVector, testPoint);
    return d > min && d < max;
}

/** Generates a defined number of points on a sphere with radius = extent around the specified centroid */
function generateSpherePoints(ctx: ANVILContext, numberOfSpherePoints: number): Vec3[] {
    const { centroid, extent } = ctx;
    const points = [];
    let oldPhi = 0, h, theta, phi;
    for(let k = 1, kl = numberOfSpherePoints + 1; k < kl; k++) {
        h = -1 + 2 * (k - 1) / (2 * numberOfSpherePoints - 1);
        theta = Math.acos(h);
        phi = (k === 1 || k === numberOfSpherePoints) ? 0 : (oldPhi + 3.6 / Math.sqrt(2 * numberOfSpherePoints * (1 - h * h))) % (2 * Math.PI);

        const point = v3create(
            extent * Math.sin(phi) * Math.sin(theta) + centroid[0],
            extent * Math.cos(theta) + centroid[1],
            extent * Math.cos(phi) * Math.sin(theta) + centroid[2]
        );
        points[k - 1] = point;
        oldPhi = phi;
    }

    return points;
}

/** Generates sphere points close to that of the initial membrane */
function findProximateAxes(ctx: ANVILContext, membrane: MembraneCandidate): Vec3[] {
    const { numberOfSpherePoints, extent } = ctx;
    const points = generateSpherePoints(ctx, 30000);
    let j = 4;
    let sphere_pts2: Vec3[] = [];
    const s = 2 * extent / numberOfSpherePoints;
    while (sphere_pts2.length < numberOfSpherePoints) {
        const dsq = (s + j) * (s + j);
        sphere_pts2 = [];
        for (let i = 0, il = points.length; i < il; i++) {
            if (v3squaredDistance(points[i], membrane.spherePoint!) < dsq) {
                sphere_pts2.push(points[i]);
            }
        }
        j += 0.2;
    }
    return sphere_pts2;
}

interface HphobHphil {
    hphob: number,
    hphil: number
}

namespace HphobHphil {
    export function initial(ctx: ANVILContext): HphobHphil {
        const { exposed, hydrophobic } = ctx;
        let hphob = 0;
        let hphil = 0;
        for (let k = 0, kl = exposed.length; k < kl; k++) {
            if (hydrophobic[k]) {
                hphob++;
            } else {
                hphil++;
            }
        }
        return { hphob, hphil };
    }

    const testPoint = v3zero();
    export function sliced(ctx: ANVILContext, stepSize: number, spherePoint: Vec3, diam: Vec3, diamNorm: number): HphobHphil[] {
        const { exposed, hydrophobic, structure } = ctx;
        const { units, serialMapping } = structure;
        const { unitIndices, elementIndices } = serialMapping;
        const sliceStats: HphobHphil[] = [];
        for (let i = 0, il = diamNorm - stepSize; i < il; i += stepSize) {
            sliceStats[sliceStats.length] = { hphob: 0, hphil: 0 };
        }

        for (let i = 0, il = exposed.length; i < il; i++) {
            const unit = units[unitIndices[exposed[i]]];
            const elementIndex = elementIndices[exposed[i]];
            v3set(testPoint, unit.conformation.x(elementIndex), unit.conformation.y(elementIndex), unit.conformation.z(elementIndex));
            v3sub(testPoint, testPoint, spherePoint);
            if (hydrophobic[i]) {
                sliceStats[Math.floor(v3dot(testPoint, diam) / diamNorm / stepSize)].hphob++;
            } else {
                sliceStats[Math.floor(v3dot(testPoint, diam) / diamNorm / stepSize)].hphil++;
            }
        }
        return sliceStats;
    }
}

/** ANVIL-specific (not general) definition of membrane-favoring amino acids */
const HYDROPHOBIC_AMINO_ACIDS = new Set(['ALA', 'CYS', 'GLY', 'HIS', 'ILE', 'LEU', 'MET', 'PHE', 'SER', 'TRP', 'VAL']);
/** Returns true if ANVIL considers this as amino acid that favors being embedded in a membrane */
export function isHydrophobic(label_comp_id: string): boolean {
    return HYDROPHOBIC_AMINO_ACIDS.has(label_comp_id);
}

/** Accessible surface area used for normalization. ANVIL uses 'Total-Side REL' values from NACCESS, from: Hubbard, S. J., & Thornton, J. M. (1993). naccess. Computer Program, Department of Biochemistry and Molecular Biology, University College London, 2(1). */
export const MaxAsa: { [k: string]: number } = {
    'ALA': 69.41,
    'ARG': 201.25,
    'ASN': 106.24,
    'ASP': 102.69,
    'CYS': 96.75,
    'GLU': 134.74,
    'GLN': 140.99,
    'GLY': 32.33,
    'HIS': 147.08,
    'ILE': 137.96,
    'LEU': 141.12,
    'LYS': 163.30,
    'MET': 156.64,
    'PHE': 164.11,
    'PRO': 119.90,
    'SER': 78.11,
    'THR': 101.70,
    'TRP': 211.26,
    'TYR': 177.38,
    'VAL': 114.28
};

function setLocation(l: StructureElement.Location, structure: Structure, serialIndex: number) {
    l.structure = structure;
    l.unit = structure.units[structure.serialMapping.unitIndices[serialIndex]];
    l.element = structure.serialMapping.elementIndices[serialIndex];
    return l;
}