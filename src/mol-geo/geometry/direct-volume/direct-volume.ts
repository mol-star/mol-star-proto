/**
 * Copyright (c) 2018-2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { hashFnv32a } from '../../../mol-data/util';
import { LocationIterator } from '../../../mol-geo/util/location-iterator';
import { RenderableState } from '../../../mol-gl/renderable';
import { DirectVolumeValues } from '../../../mol-gl/renderable/direct-volume';
import { calculateTransformBoundingSphere } from '../../../mol-gl/renderable/util';
import { Texture } from '../../../mol-gl/webgl/texture';
import { Box3D, Sphere3D } from '../../../mol-math/geometry';
import { Mat4, Vec2, Vec3, Vec4 } from '../../../mol-math/linear-algebra';
import { Theme } from '../../../mol-theme/theme';
import { ValueCell } from '../../../mol-util';
import { Color } from '../../../mol-util/color';
import { ParamDefinition as PD } from '../../../mol-util/param-definition';
import { Box } from '../../primitive/box';
import { BaseGeometry } from '../base';
import { createColors } from '../color-data';
import { GeometryUtils } from '../geometry';
import { createMarkers } from '../marker-data';
import { createEmptyOverpaint } from '../overpaint-data';
import { TransformData } from '../transform-data';
import { createEmptyTransparency } from '../transparency-data';
import { createTransferFunctionTexture, getControlPointsFromVec2Array } from './transfer-function';
import { createEmptyClipping } from '../clipping-data';
import { Grid, Volume } from '../../../mol-model/volume';

const VolumeBox = Box();

export interface DirectVolume {
    readonly kind: 'direct-volume',

    readonly gridTexture: ValueCell<Texture>
    readonly gridTextureDim: ValueCell<Vec3>
    readonly gridDimension: ValueCell<Vec3>
    readonly gridStats: ValueCell<Vec4> // [min, max, mean, sigma]
    readonly bboxSize: ValueCell<Vec3>
    readonly bboxMin: ValueCell<Vec3>
    readonly bboxMax: ValueCell<Vec3>
    readonly transform: ValueCell<Mat4>

    /** Bounding sphere of the volume */
    boundingSphere: Sphere3D
}

export namespace DirectVolume {
    export function create(bbox: Box3D, gridDimension: Vec3, transform: Mat4, texture: Texture, stats: Grid['stats'], directVolume?: DirectVolume): DirectVolume {
        return directVolume ?
            update(bbox, gridDimension, transform, texture, stats, directVolume) :
            fromData(bbox, gridDimension, transform, texture, stats);
    }

    function hashCode(directVolume: DirectVolume) {
        return hashFnv32a([
            directVolume.bboxSize.ref.version, directVolume.gridDimension.ref.version,
            directVolume.gridTexture.ref.version, directVolume.transform.ref.version,
            directVolume.gridStats.ref.version
        ]);
    }

    function fromData(bbox: Box3D, gridDimension: Vec3, transform: Mat4, texture: Texture, stats: Grid['stats']): DirectVolume {
        const boundingSphere = Sphere3D();
        let currentHash = -1;

        const width = texture.getWidth();
        const height = texture.getHeight();
        const depth = texture.getDepth();

        const directVolume = {
            kind: 'direct-volume' as const,
            gridDimension: ValueCell.create(gridDimension),
            gridTexture: ValueCell.create(texture),
            gridTextureDim: ValueCell.create(Vec3.create(width, height, depth)),
            gridStats: ValueCell.create(Vec4.create(stats.min, stats.max, stats.mean, stats.sigma)),
            bboxMin: ValueCell.create(bbox.min),
            bboxMax: ValueCell.create(bbox.max),
            bboxSize: ValueCell.create(Vec3.sub(Vec3.zero(), bbox.max, bbox.min)),
            transform: ValueCell.create(transform),
            get boundingSphere() {
                const newHash = hashCode(directVolume);
                if (newHash !== currentHash) {
                    const b = getBoundingSphere(directVolume.gridDimension.ref.value, directVolume.transform.ref.value);
                    Sphere3D.copy(boundingSphere, b);
                    currentHash = newHash;
                }
                return boundingSphere;
            },
        };
        return directVolume;
    }

    function update(bbox: Box3D, gridDimension: Vec3, transform: Mat4, texture: Texture, stats: Grid['stats'], directVolume: DirectVolume): DirectVolume {
        const width = texture.getWidth();
        const height = texture.getHeight();
        const depth = texture.getDepth();

        ValueCell.update(directVolume.gridDimension, gridDimension);
        ValueCell.update(directVolume.gridTexture, texture);
        ValueCell.update(directVolume.gridTextureDim, Vec3.set(directVolume.gridTextureDim.ref.value, width, height, depth));
        ValueCell.update(directVolume.gridStats, Vec4.set(directVolume.gridStats.ref.value, stats.min, stats.max, stats.mean, stats.sigma));
        ValueCell.update(directVolume.bboxMin, bbox.min);
        ValueCell.update(directVolume.bboxMax, bbox.max);
        ValueCell.update(directVolume.bboxSize, Vec3.sub(directVolume.bboxSize.ref.value, bbox.max, bbox.min));
        ValueCell.update(directVolume.transform, transform);
        return directVolume;
    }

    export function createEmpty(directVolume?: DirectVolume): DirectVolume {
        return {} as DirectVolume; // TODO
    }

    export function createRenderModeParam(volume?: Volume) {
        const isoValueParam = volume
            ? Volume.createIsoValueParam(Volume.IsoValue.relative(2), volume.grid.stats)
            : Volume.IsoValueParam;

        return PD.MappedStatic('volume', {
            isosurface: PD.Group({
                isoValue: isoValueParam,
            }, { isFlat: true }),
            volume: PD.Group({
                controlPoints: PD.LineGraph([
                    Vec2.create(0.19, 0.0), Vec2.create(0.2, 0.05), Vec2.create(0.25, 0.05), Vec2.create(0.26, 0.0),
                    Vec2.create(0.79, 0.0), Vec2.create(0.8, 0.05), Vec2.create(0.85, 0.05), Vec2.create(0.86, 0.0),
                ]),
                list: PD.ColorList('red-yellow-blue'),
            }, { isFlat: true })
        }, { isEssential: true });
    }

    export const Params = {
        ...BaseGeometry.Params,
        // doubleSided: PD.Boolean(false, BaseGeometry.CustomQualityParamInfo),
        // flipSided: PD.Boolean(false, BaseGeometry.ShadingCategory),
        flatShaded: PD.Boolean(false, BaseGeometry.ShadingCategory),
        ignoreLight: PD.Boolean(false, BaseGeometry.ShadingCategory),
        renderMode: createRenderModeParam(),
    };
    export type Params = typeof Params

    export const Utils: GeometryUtils<DirectVolume, Params> = {
        Params,
        createEmpty,
        createValues,
        createValuesSimple,
        updateValues,
        updateBoundingSphere,
        createRenderableState,
        updateRenderableState
    };

    function getNormalizedIsoValue(out: Vec2, isoValue: Volume.IsoValue, stats: Vec4) {
        const [min, max, mean, sigma] = stats;
        const value = Volume.IsoValue.toAbsolute(isoValue, { min, max, mean, sigma }).absoluteValue;
        Vec2.set(out, (value - min) / (max - min), (0 - min) / (max - min));
        return out;
    }

    function createValues(directVolume: DirectVolume, transform: TransformData, locationIt: LocationIterator, theme: Theme, props: PD.Values<Params>): DirectVolumeValues {
        const { gridTexture, gridTextureDim, gridStats } = directVolume;
        const { bboxSize, bboxMin, bboxMax, gridDimension, transform: gridTransform } = directVolume;

        const { instanceCount, groupCount } = locationIt;
        const color = createColors(locationIt, theme.color);
        const marker = createMarkers(instanceCount * groupCount);
        const overpaint = createEmptyOverpaint();
        const transparency = createEmptyTransparency();
        const clipping = createEmptyClipping();

        const counts = { drawCount: VolumeBox.indices.length, groupCount, instanceCount };

        const invariantBoundingSphere = Sphere3D.clone(directVolume.boundingSphere);
        const boundingSphere = calculateTransformBoundingSphere(invariantBoundingSphere, transform.aTransform.ref.value, instanceCount);

        const controlPoints = props.renderMode.name === 'volume' ? getControlPointsFromVec2Array(props.renderMode.params.controlPoints) : [];
        const transferTex = createTransferFunctionTexture(controlPoints, props.renderMode.name === 'volume' ? props.renderMode.params.list.colors : []);

        const isoValue = props.renderMode.name === 'isosurface'
            ? props.renderMode.params.isoValue
            : Volume.IsoValue.relative(2);

        const maxSteps = Math.ceil(Vec3.magnitude(gridDimension.ref.value) * 5);

        return {
            ...color,
            ...marker,
            ...overpaint,
            ...transparency,
            ...clipping,
            ...transform,
            ...BaseGeometry.createValues(props, counts),

            aPosition: ValueCell.create(VolumeBox.vertices as Float32Array),
            elements: ValueCell.create(VolumeBox.indices as Uint32Array),
            boundingSphere: ValueCell.create(boundingSphere),
            invariantBoundingSphere: ValueCell.create(invariantBoundingSphere),
            uInvariantBoundingSphere: ValueCell.create(Vec4.ofSphere(invariantBoundingSphere)),

            uIsoValue: ValueCell.create(getNormalizedIsoValue(Vec2(), isoValue, directVolume.gridStats.ref.value)),
            uBboxMin: bboxMin,
            uBboxMax: bboxMax,
            uBboxSize: bboxSize,
            uMaxSteps: ValueCell.create(maxSteps),
            uTransform: gridTransform,
            uGridDim: gridDimension,
            dRenderMode: ValueCell.create(props.renderMode.name),
            tTransferTex: transferTex,

            dGridTexType: ValueCell.create(gridTexture.ref.value.getDepth() > 0 ? '3d' : '2d'),
            uGridTexDim: gridTextureDim,
            tGridTex: gridTexture,
            uGridStats: gridStats,

            dDoubleSided: ValueCell.create(false),
            dFlatShaded: ValueCell.create(props.flatShaded),
            dFlipSided: ValueCell.create(true),
            dIgnoreLight: ValueCell.create(props.ignoreLight),
        };
    }

    function createValuesSimple(directVolume: DirectVolume, props: Partial<PD.Values<Params>>, colorValue: Color, sizeValue: number, transform?: TransformData) {
        const s = BaseGeometry.createSimple(colorValue, sizeValue, transform);
        const p = { ...PD.getDefaultValues(Params), ...props };
        return createValues(directVolume, s.transform, s.locationIterator, s.theme, p);
    }

    function updateValues(values: DirectVolumeValues, props: PD.Values<Params>) {
        ValueCell.updateIfChanged(values.alpha, props.alpha);
        ValueCell.updateIfChanged(values.uAlpha, props.alpha);
        // ValueCell.updateIfChanged(values.dDoubleSided, props.doubleSided);
        ValueCell.updateIfChanged(values.dFlatShaded, props.flatShaded);
        // ValueCell.updateIfChanged(values.dFlipSided, props.flipSided);
        ValueCell.updateIfChanged(values.dIgnoreLight, props.ignoreLight);
        ValueCell.updateIfChanged(values.dRenderMode, props.renderMode.name);

        if (props.renderMode.name === 'isosurface') {
            ValueCell.updateIfChanged(values.uIsoValue, getNormalizedIsoValue(values.uIsoValue.ref.value, props.renderMode.params.isoValue, values.uGridStats.ref.value));
        } else if (props.renderMode.name === 'volume') {
            const controlPoints = getControlPointsFromVec2Array(props.renderMode.params.controlPoints);
            createTransferFunctionTexture(controlPoints, props.renderMode.params.list.colors, values.tTransferTex);
        }
    }

    function updateBoundingSphere(values: DirectVolumeValues, directVolume: DirectVolume) {
        const invariantBoundingSphere = Sphere3D.clone(directVolume.boundingSphere);
        const boundingSphere = calculateTransformBoundingSphere(invariantBoundingSphere, values.aTransform.ref.value, values.instanceCount.ref.value);

        if (!Sphere3D.equals(boundingSphere, values.boundingSphere.ref.value)) {
            ValueCell.update(values.boundingSphere, boundingSphere);
        }
        if (!Sphere3D.equals(invariantBoundingSphere, values.invariantBoundingSphere.ref.value)) {
            ValueCell.update(values.invariantBoundingSphere, invariantBoundingSphere);
            ValueCell.update(values.uInvariantBoundingSphere, Vec4.fromSphere(values.uInvariantBoundingSphere.ref.value, invariantBoundingSphere));
        }
    }

    function createRenderableState(props: PD.Values<Params>): RenderableState {
        const state = BaseGeometry.createRenderableState(props);
        state.opaque = false;
        return state;
    }

    function updateRenderableState(state: RenderableState, props: PD.Values<Params>) {
        BaseGeometry.updateRenderableState(state, props);
        state.opaque = false;
        state.writeDepth = props.renderMode.name === 'isosurface';
    }
}

//

function getBoundingSphere(gridDimension: Vec3, gridTransform: Mat4) {
    return Sphere3D.fromDimensionsAndTransform(Sphere3D(), gridDimension, gridTransform);
}