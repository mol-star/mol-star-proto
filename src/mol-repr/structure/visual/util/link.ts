/**
 * Copyright (c) 2018-2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { Vec3 } from '../../../../mol-math/linear-algebra';
import { ParamDefinition as PD } from '../../../../mol-util/param-definition';
import { Mesh } from '../../../../mol-geo/geometry/mesh/mesh';
import { MeshBuilder } from '../../../../mol-geo/geometry/mesh/mesh-builder';
import { CylinderProps } from '../../../../mol-geo/primitive/cylinder';
import { addFixedCountDashedCylinder, addCylinder, addDoubleCylinder } from '../../../../mol-geo/geometry/mesh/builder/cylinder';
import { VisualContext } from '../../../visual';
import { BaseGeometry } from '../../../../mol-geo/geometry/base';
import { Lines } from '../../../../mol-geo/geometry/lines/lines';
import { LinesBuilder } from '../../../../mol-geo/geometry/lines/lines-builder';

export const LinkCylinderParams = {
    linkScale: PD.Numeric(0.4, { min: 0, max: 1, step: 0.1 }),
    linkSpacing: PD.Numeric(1, { min: 0, max: 2, step: 0.01 }),
    linkCap: PD.Boolean(false),
    radialSegments: PD.Numeric(16, { min: 2, max: 56, step: 2 }, BaseGeometry.CustomQualityParamInfo),
};
export const DefaultLinkCylinderProps = PD.getDefaultValues(LinkCylinderParams);
export type LinkCylinderProps = typeof DefaultLinkCylinderProps

export const LinkLineParams = {
    linkScale: PD.Numeric(0.5, { min: 0, max: 1, step: 0.1 }),
    linkSpacing: PD.Numeric(0.1, { min: 0, max: 2, step: 0.01 }),
};
export const DefaultLinkLineProps = PD.getDefaultValues(LinkLineParams);
export type LinkLineProps = typeof DefaultLinkLineProps

const tmpV12 = Vec3();
const tmpShiftV12 = Vec3();
const tmpShiftV13 = Vec3();
const up = Vec3.create(0, 1, 0);

/** Calculate 'shift' direction that is perpendiculat to v1 - v2 and goes through v3 */
export function calculateShiftDir (out: Vec3, v1: Vec3, v2: Vec3, v3: Vec3 | null) {
    Vec3.normalize(tmpShiftV12, Vec3.sub(tmpShiftV12, v1, v2));
    if (v3 !== null) {
        Vec3.sub(tmpShiftV13, v1, v3);
    } else {
        Vec3.copy(tmpShiftV13, v1);  // no reference point, use v1
    }
    Vec3.normalize(tmpShiftV13, tmpShiftV13);

    // ensure v13 and v12 are not colinear
    let dp = Vec3.dot(tmpShiftV12, tmpShiftV13);
    if (1 - Math.abs(dp) < 1e-5) {
        Vec3.set(tmpShiftV13, 1, 0, 0);
        dp = Vec3.dot(tmpShiftV12, tmpShiftV13);
        if (1 - Math.abs(dp) < 1e-5) {
            Vec3.set(tmpShiftV13, 0, 1, 0);
            dp = Vec3.dot(tmpShiftV12, tmpShiftV13);
        }
    }

    Vec3.setMagnitude(tmpShiftV12, tmpShiftV12, dp);
    Vec3.sub(tmpShiftV13, tmpShiftV13, tmpShiftV12);
    return Vec3.normalize(out, tmpShiftV13);
}

export interface LinkBuilderProps {
    linkCount: number
    position: (posA: Vec3, posB: Vec3, edgeIndex: number) => void
    radius: (edgeIndex: number) => number,
    referencePosition?: (edgeIndex: number) => Vec3 | null
    style?: (edgeIndex: number) => LinkStyle
    ignore?: (edgeIndex: number) => boolean
}

export const enum LinkStyle {
    Solid = 0,
    Dashed = 1,
    Double = 2,
    Triple = 3,
    Disk = 4
}

// avoiding namespace lookup improved performance in Chrome (Aug 2020)
const v3scale = Vec3.scale;
const v3add = Vec3.add;
const v3sub = Vec3.sub;
const v3setMagnitude = Vec3.setMagnitude;
const v3dot = Vec3.dot;

/**
 * Each edge is included twice to allow for coloring/picking
 * the half closer to the first vertex, i.e. vertex a.
 */
export function createLinkCylinderMesh(ctx: VisualContext, linkBuilder: LinkBuilderProps, props: LinkCylinderProps, mesh?: Mesh) {
    const { linkCount, referencePosition, position, style, radius, ignore } = linkBuilder;

    if (!linkCount) return Mesh.createEmpty(mesh);

    const { linkScale, linkSpacing, radialSegments, linkCap } = props;

    const vertexCountEstimate = radialSegments * 2 * linkCount * 2;
    const builderState = MeshBuilder.createState(vertexCountEstimate, vertexCountEstimate / 4, mesh);

    const va = Vec3();
    const vb = Vec3();
    const vShift = Vec3();
    const cylinderProps: CylinderProps = {
        radiusTop: 1,
        radiusBottom: 1,
        radialSegments,
        topCap: linkCap,
        bottomCap: linkCap
    };

    for (let edgeIndex = 0, _eI = linkCount; edgeIndex < _eI; ++edgeIndex) {
        if (ignore && ignore(edgeIndex)) continue;

        position(va, vb, edgeIndex);

        const linkRadius = radius(edgeIndex);
        const linkStyle = style ? style(edgeIndex) : LinkStyle.Solid;
        builderState.currentGroup = edgeIndex;

        if (linkStyle === LinkStyle.Solid) {
            cylinderProps.radiusTop = cylinderProps.radiusBottom = linkRadius;
            cylinderProps.topCap = cylinderProps.bottomCap = linkCap;

            addCylinder(builderState, va, vb, 0.5, cylinderProps);
        } else if (linkStyle === LinkStyle.Dashed) {
            cylinderProps.radiusTop = cylinderProps.radiusBottom = linkRadius / 3;
            cylinderProps.topCap = cylinderProps.bottomCap = true;

            addFixedCountDashedCylinder(builderState, va, vb, 0.5, 7, cylinderProps);
        } else if (linkStyle === LinkStyle.Double || linkStyle === LinkStyle.Triple) {
            const order = LinkStyle.Double ? 2 : 3;
            const multiRadius = linkRadius * (linkScale / (0.5 * order));
            const absOffset = (linkRadius - multiRadius) * linkSpacing;

            calculateShiftDir(vShift, va, vb, referencePosition ? referencePosition(edgeIndex) : null);
            v3setMagnitude(vShift, vShift, absOffset);

            cylinderProps.radiusTop = cylinderProps.radiusBottom = multiRadius;
            cylinderProps.topCap = cylinderProps.bottomCap = linkCap;

            if (order === 3) addCylinder(builderState, va, vb, 0.5, cylinderProps);
            addDoubleCylinder(builderState, va, vb, 0.5, vShift, cylinderProps);
        } else if (linkStyle === LinkStyle.Disk) {
            v3scale(tmpV12, v3sub(tmpV12, vb, va), 0.475);
            v3add(va, va, tmpV12);
            v3sub(vb, vb, tmpV12);

            cylinderProps.radiusTop = cylinderProps.radiusBottom = linkRadius;
            if (v3dot(tmpV12, up) > 0) {
                cylinderProps.topCap = false;
                cylinderProps.bottomCap = linkCap;
            } else {
                cylinderProps.topCap = linkCap;
                cylinderProps.bottomCap = false;
            }

            addCylinder(builderState, va, vb, 0.5, cylinderProps);
        }
    }

    return MeshBuilder.getMesh(builderState);
}

/**
 * Each edge is included twice to allow for coloring/picking
 * the half closer to the first vertex, i.e. vertex a.
 */
export function createLinkLines(ctx: VisualContext, linkBuilder: LinkBuilderProps, props: LinkLineProps, lines?: Lines) {
    const { linkCount, referencePosition, position, style, ignore } = linkBuilder;

    if (!linkCount) return Lines.createEmpty(lines);

    const { linkScale, linkSpacing } = props;

    const linesCountEstimate = linkCount * 2;
    const builder = LinesBuilder.create(linesCountEstimate, linesCountEstimate / 4, lines);

    const va = Vec3();
    const vb = Vec3();
    const vShift = Vec3();

    for (let edgeIndex = 0, _eI = linkCount; edgeIndex < _eI; ++edgeIndex) {
        if (ignore && ignore(edgeIndex)) continue;

        position(va, vb, edgeIndex);
        v3scale(vb, v3add(vb, va, vb), 0.5);

        const linkStyle = style ? style(edgeIndex) : LinkStyle.Solid;

        if (linkStyle === LinkStyle.Solid) {
            builder.add(va[0], va[1], va[2], vb[0], vb[1], vb[2], edgeIndex);
        } else if (linkStyle === LinkStyle.Dashed) {
            builder.addFixedCountDashes(va, vb, 7, edgeIndex);
        } else if (linkStyle === LinkStyle.Double || linkStyle === LinkStyle.Triple) {
            const order = LinkStyle.Double ? 2 : 3;
            const multiRadius = 1 * (linkScale / (0.5 * order));
            const absOffset = (1 - multiRadius) * linkSpacing;

            calculateShiftDir(vShift, va, vb, referencePosition ? referencePosition(edgeIndex) : null);
            v3setMagnitude(vShift, vShift, absOffset);

            if (order === 3) builder.add(va[0], va[1], va[2], vb[0], vb[1], vb[2], edgeIndex);
            builder.add(va[0] + vShift[0], va[1] + vShift[1], va[2] + vShift[2], vb[0] + vShift[0], vb[1] + vShift[1], vb[2] + vShift[2], edgeIndex);
            builder.add(va[0] - vShift[0], va[1] - vShift[1], va[2] - vShift[2], vb[0] - vShift[0], vb[1] - vShift[1], vb[2] - vShift[2], edgeIndex);
        } else if (linkStyle === LinkStyle.Disk) {
            v3scale(tmpV12, v3sub(tmpV12, vb, va), 0.475);
            v3add(va, va, tmpV12);
            v3sub(vb, vb, tmpV12);

            // TODO what to do here? Line as disk doesn't work well.
            builder.add(va[0], va[1], va[2], vb[0], vb[1], vb[2], edgeIndex);
        }
    }

    return builder.getLines();
}