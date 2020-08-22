/**
 * Copyright (c) 2018-2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { PositionData } from './common';
import { Vec3 } from '../linear-algebra';
import { OrderedSet } from '../../mol-data/int';
import { BoundaryHelper } from './boundary-helper';
import { Box3D, Sphere3D } from '../geometry';

export type Boundary = { readonly box: Box3D, readonly sphere: Sphere3D }

// avoiding namespace lookup improved performance in Chrome (Aug 2020)
const v3set = Vec3.set;
const v3squaredDistance = Vec3.squaredDistance;

const boundaryHelperCoarse = new BoundaryHelper('14');
const boundaryHelperFine = new BoundaryHelper('98');
function getBoundaryHelper(count: number) {
    return count > 10_000 ? boundaryHelperCoarse : boundaryHelperFine;
}

const p = Vec3();

export function getBoundary(data: PositionData): Boundary {
    const { x, y, z, radius, indices } = data;
    const n = OrderedSet.size(indices);

    const boundaryHelper = getBoundaryHelper(n);
    boundaryHelper.reset();
    for (let t = 0; t < n; t++) {
        const i = OrderedSet.getAt(indices, t);
        v3set(p, x[i], y[i], z[i]);
        boundaryHelper.includePositionRadius(p, (radius && radius[i]) || 0);
    }
    boundaryHelper.finishedIncludeStep();
    for (let t = 0; t < n; t++) {
        const i = OrderedSet.getAt(indices, t);
        v3set(p, x[i], y[i], z[i]);
        boundaryHelper.radiusPositionRadius(p, (radius && radius[i]) || 0);
    }

    const sphere = boundaryHelper.getSphere();

    if (!radius && Sphere3D.hasExtrema(sphere) && n <= sphere.extrema.length) {
        const extrema: Vec3[] = [];
        for (let t = 0; t < n; t++) {
            const i = OrderedSet.getAt(indices, t);
            extrema.push(Vec3.create(x[i], y[i], z[i]));
        }
        Sphere3D.setExtrema(sphere, extrema);
    }

    return { box: boundaryHelper.getBox(), sphere };
}

export function tryAdjustBoundary(data: PositionData, boundary: Boundary): Boundary | undefined {
    const { x, y, z, indices } = data;
    const n = OrderedSet.size(indices);
    const { center, radius } = boundary.sphere;

    let maxDistSq = 0;
    for (let t = 0; t < n; t++) {
        const i = OrderedSet.getAt(indices, t);
        v3set(p, x[i], y[i], z[i]);
        const distSq = v3squaredDistance(p, center);
        if (distSq > maxDistSq) maxDistSq = distSq;
    }

    const adjustedRadius = Math.sqrt(maxDistSq);
    const deltaRadius = adjustedRadius - radius;
    if (Math.abs(deltaRadius) < radius / 100) {
        // TODO: The expanded sphere extrema are not correct if the principal axes differ
        const sphere = Sphere3D.expand(Sphere3D(), boundary.sphere, deltaRadius);
        const box = Box3D.fromSphere3D(Box3D(), sphere);
        return { box, sphere };
    } else {
        return undefined;
    }
}