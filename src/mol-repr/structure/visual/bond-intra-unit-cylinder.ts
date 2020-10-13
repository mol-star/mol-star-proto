/**
 * Copyright (c) 2018-2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @author David Sehnal <david.sehnal@gmail.com>
 */

import { ParamDefinition as PD } from '../../../mol-util/param-definition';
import { VisualContext } from '../../visual';
import { Unit, Structure, StructureElement } from '../../../mol-model/structure';
import { Theme } from '../../../mol-theme/theme';
import { Mesh } from '../../../mol-geo/geometry/mesh/mesh';
import { Vec3 } from '../../../mol-math/linear-algebra';
import { arrayEqual } from '../../../mol-util';
import { createLinkCylinderMesh, LinkStyle } from './util/link';
import { UnitsMeshParams, UnitsVisual, UnitsMeshVisual, StructureGroup } from '../units-visual';
import { VisualUpdateState } from '../../util';
import { BondType } from '../../../mol-model/structure/model/types';
import { BondCylinderParams, BondIterator, eachIntraBond, getIntraBondLoci, makeIntraBondIgnoreTest } from './util/bond';
import { Sphere3D } from '../../../mol-math/geometry';
import { IntAdjacencyGraph } from '../../../mol-math/graph';

// avoiding namespace lookup improved performance in Chrome (Aug 2020)
const isBondType = BondType.is;

function createIntraUnitBondCylinderMesh(ctx: VisualContext, unit: Unit, structure: Structure, theme: Theme, props: PD.Values<IntraUnitBondCylinderParams>, mesh?: Mesh) {
    if (!Unit.isAtomic(unit)) return Mesh.createEmpty(mesh);

    const location = StructureElement.Location.create(structure, unit);

    const elements = unit.elements;
    const bonds = unit.bonds;
    const { edgeCount, a, b, edgeProps, offset } = bonds;
    const { order: _order, flags: _flags } = edgeProps;
    const { sizeFactor, sizeAspectRatio } = props;

    if (!edgeCount) return Mesh.createEmpty(mesh);

    const vRef = Vec3(), delta = Vec3();
    const pos = unit.conformation.invariantPosition;

    const radiusA = (edgeIndex: number) => {
        location.element = elements[a[edgeIndex]];
        return theme.size.size(location) * sizeFactor;
    };

    const radiusB = (edgeIndex: number) => {
        location.element = elements[b[edgeIndex]];
        return theme.size.size(location) * sizeFactor;
    };

    const builderProps = {
        linkCount: edgeCount * 2,
        referencePosition: (edgeIndex: number) => {
            let aI = a[edgeIndex], bI = b[edgeIndex];

            if (aI > bI) [aI, bI] = [bI, aI];
            if (offset[aI + 1] - offset[aI] === 1) [aI, bI] = [bI, aI];
            // TODO prefer reference atoms within rings

            for (let i = offset[aI], il = offset[aI + 1]; i < il; ++i) {
                const _bI = b[i];
                if (_bI !== bI && _bI !== aI) return pos(elements[_bI], vRef);
            }
            for (let i = offset[bI], il = offset[bI + 1]; i < il; ++i) {
                const _aI = a[i];
                if (_aI !== aI && _aI !== bI) return pos(elements[_aI], vRef);
            }
            return null;
        },
        position: (posA: Vec3, posB: Vec3, edgeIndex: number) => {
            const rA = radiusA(edgeIndex), rB = radiusB(edgeIndex);
            const r = Math.min(rA, rB) * sizeAspectRatio;
            const oA = Math.sqrt(Math.max(0, rA * rA - r * r)) - 0.05;
            const oB = Math.sqrt(Math.max(0, rB * rB - r * r)) - 0.05;
                        
            pos(elements[a[edgeIndex]], posA);
            pos(elements[b[edgeIndex]], posB);

            if (oA <= 0.01 && oB <= 0.01) return;

            Vec3.normalize(delta, Vec3.sub(delta, posB, posA));
            Vec3.scaleAndAdd(posA, posA, delta, oA);
            Vec3.scaleAndAdd(posB, posB, delta, -oB);
        },
        style: (edgeIndex: number) => {
            const o = _order[edgeIndex];
            const f = _flags[edgeIndex];
            if (isBondType(f, BondType.Flag.MetallicCoordination) || isBondType(f, BondType.Flag.HydrogenBond)) {
                // show metall coordinations and hydrogen bonds with dashed cylinders
                return LinkStyle.Dashed;
            } else if (o === 2) {
                return LinkStyle.Double;
            } else if (o === 3) {
                return LinkStyle.Triple;
            } else {
                return LinkStyle.Solid;
            }
        },
        radius: (edgeIndex: number) => {
            return Math.min(radiusA(edgeIndex), radiusB(edgeIndex)) * sizeAspectRatio;
        },
        ignore: makeIntraBondIgnoreTest(unit, props)
    };

    const m = createLinkCylinderMesh(ctx, builderProps, props, mesh);

    const sphere = Sphere3D.expand(Sphere3D(), unit.boundary.sphere, 1 * sizeFactor);
    m.setBoundingSphere(sphere);

    return m;
}

export const IntraUnitBondCylinderParams = {
    ...UnitsMeshParams,
    ...BondCylinderParams,
    sizeFactor: PD.Numeric(0.3, { min: 0, max: 10, step: 0.01 }),
    sizeAspectRatio: PD.Numeric(2 / 3, { min: 0, max: 3, step: 0.01 }),
};
export type IntraUnitBondCylinderParams = typeof IntraUnitBondCylinderParams

export function IntraUnitBondCylinderVisual(materialId: number): UnitsVisual<IntraUnitBondCylinderParams> {
    return UnitsMeshVisual<IntraUnitBondCylinderParams>({
        defaultProps: PD.getDefaultValues(IntraUnitBondCylinderParams),
        createGeometry: createIntraUnitBondCylinderMesh,
        createLocationIterator: BondIterator.fromGroup,
        getLoci: getIntraBondLoci,
        eachLocation: eachIntraBond,
        setUpdateState: (state: VisualUpdateState, newProps: PD.Values<IntraUnitBondCylinderParams>, currentProps: PD.Values<IntraUnitBondCylinderParams>, newTheme: Theme, currentTheme: Theme, newStructureGroup: StructureGroup, currentStructureGroup: StructureGroup) => {
            state.createGeometry = (
                newProps.sizeFactor !== currentProps.sizeFactor ||
                newProps.sizeAspectRatio !== currentProps.sizeAspectRatio ||
                newProps.radialSegments !== currentProps.radialSegments ||
                newProps.linkScale !== currentProps.linkScale ||
                newProps.linkSpacing !== currentProps.linkSpacing ||
                newProps.ignoreHydrogens !== currentProps.ignoreHydrogens ||
                newProps.linkCap !== currentProps.linkCap ||
                !arrayEqual(newProps.includeTypes, currentProps.includeTypes) ||
                !arrayEqual(newProps.excludeTypes, currentProps.excludeTypes)
            );

            const newUnit = newStructureGroup.group.units[0];
            const currentUnit = currentStructureGroup.group.units[0];
            if (Unit.isAtomic(newUnit) && Unit.isAtomic(currentUnit)) {
                if (!IntAdjacencyGraph.areEqual(newUnit.bonds, currentUnit.bonds)) {
                    state.createGeometry = true;
                    state.updateColor = true;
                    state.updateSize = true;
                }
            }
        }
    }, materialId);
}