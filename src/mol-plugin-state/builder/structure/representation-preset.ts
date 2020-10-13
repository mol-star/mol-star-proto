/**
 * Copyright (c) 2019-2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { PresetProvider } from '../preset-provider';
import { PluginStateObject } from '../../objects';
import { ParamDefinition as PD } from '../../../mol-util/param-definition';
import { VisualQuality, VisualQualityOptions } from '../../../mol-geo/geometry/base';
import { ColorTheme } from '../../../mol-theme/color';
import { Structure } from '../../../mol-model/structure';
import { PluginContext } from '../../../mol-plugin/context';
import { StateObjectRef, StateObjectSelector } from '../../../mol-state';
import { StaticStructureComponentType } from '../../helpers/structure-component';
import { StructureSelectionQueries as Q } from '../../helpers/structure-selection-query';
import { PluginConfig } from '../../../mol-plugin/config';
import { StructureFocusRepresentation } from '../../../mol-plugin/behavior/dynamic/selection/structure-focus-representation';
import { createStructureColorThemeParams } from '../../helpers/structure-representation-params';
import { ChainIdColorThemeProvider } from '../../../mol-theme/color/chain-id';
import { OperatorNameColorThemeProvider } from '../../../mol-theme/color/operator-name';

export interface StructureRepresentationPresetProvider<P = any, S extends _Result = _Result> extends PresetProvider<PluginStateObject.Molecule.Structure, P, S> { }
export function StructureRepresentationPresetProvider<P, S extends _Result>(repr: StructureRepresentationPresetProvider<P, S>) { return repr; }
export namespace StructureRepresentationPresetProvider {
    export type Params<P extends StructureRepresentationPresetProvider> = P extends StructureRepresentationPresetProvider<infer T> ? T : never;
    export type State<P extends StructureRepresentationPresetProvider> = P extends StructureRepresentationPresetProvider<infer _, infer S> ? S : never;
    export type Result = {
        components?: { [name: string]: StateObjectSelector | undefined },
        representations?: { [name: string]: StateObjectSelector | undefined }
    }

    export const CommonParams = {
        ignoreHydrogens: PD.Optional(PD.Boolean(false)),
        quality: PD.Optional(PD.Select<VisualQuality>('auto', VisualQualityOptions)),
        theme: PD.Optional(PD.Group({
            globalName: PD.Optional(PD.Text<ColorTheme.BuiltIn>('')),
            carbonColor: PD.Optional(PD.Select('chain-id', PD.arrayToOptions(['chain-id', 'operator-name', 'element-symbol'] as const))),
            focus: PD.Optional(PD.Group({
                name: PD.Optional(PD.Text<ColorTheme.BuiltIn>('')),
                params: PD.Optional(PD.Value<ColorTheme.BuiltInParams<ColorTheme.BuiltIn>>({} as any))
            }))
        }))
    };
    export type CommonParams = PD.ValuesFor<typeof CommonParams>

    function getCarbonColorParams(name: 'chain-id' | 'operator-name' | 'element-symbol') {
        return name === 'chain-id'
            ? { name, params: ChainIdColorThemeProvider.defaultValues }
            : name === 'operator-name'
                ? { name, params: OperatorNameColorThemeProvider.defaultValues }
                : { name, params: {} };
    }

    export function reprBuilder(plugin: PluginContext, params: CommonParams) {
        const update = plugin.state.data.build();
        const builder = plugin.builders.structure.representation;
        const typeParams = {
            quality: plugin.managers.structure.component.state.options.visualQuality,
            ignoreHydrogens: !plugin.managers.structure.component.state.options.showHydrogens,
        };
        if (params.quality && params.quality !== 'auto') typeParams.quality = params.quality;
        if (params.ignoreHydrogens !== void 0) typeParams.ignoreHydrogens = !!params.ignoreHydrogens;
        const color: ColorTheme.BuiltIn | undefined = params.theme?.globalName ? params.theme?.globalName : void 0;
        const ballAndStickColor: ColorTheme.BuiltInParams<'element-symbol'> = params.theme?.carbonColor !== undefined
            ? { carbonColor: getCarbonColorParams(params.theme?.carbonColor) }
            : { };

        return { update, builder, color, typeParams, ballAndStickColor };
    }

    export function updateFocusRepr<T extends ColorTheme.BuiltIn>(plugin: PluginContext, structure: Structure, themeName: T | undefined, themeParams: ColorTheme.BuiltInParams<T> | undefined) {
        return plugin.state.updateBehavior(StructureFocusRepresentation, p => {
            const c = createStructureColorThemeParams(plugin, structure, 'ball-and-stick', themeName || 'element-symbol', themeParams);
            p.surroundingsParams.colorTheme = c;
            p.targetParams.colorTheme = c;
        });
    }
}

type _Result = StructureRepresentationPresetProvider.Result

const CommonParams = StructureRepresentationPresetProvider.CommonParams;
type CommonParams = StructureRepresentationPresetProvider.CommonParams
const reprBuilder = StructureRepresentationPresetProvider.reprBuilder;
const updateFocusRepr = StructureRepresentationPresetProvider.updateFocusRepr;

const auto = StructureRepresentationPresetProvider({
    id: 'preset-structure-representation-auto',
    display: {
        name: 'Automatic',
        description: 'Show representations based on the size of the structure. Smaller structures are shown with more detail than larger ones, ranging from atomistic display to coarse surfaces.'
    },
    params: () => CommonParams,
    apply(ref, params, plugin) {
        const structure = StateObjectRef.resolveAndCheck(plugin.state.data, ref)?.obj?.data;
        if (!structure) return { };

        const thresholds = plugin.config.get(PluginConfig.Structure.SizeThresholds) || Structure.DefaultSizeThresholds;
        const size = Structure.getSize(structure, thresholds);

        switch (size) {
            case Structure.Size.Gigantic:
            case Structure.Size.Huge:
                return coarseSurface.apply(ref, params, plugin);
            case Structure.Size.Large:
                return polymerCartoon.apply(ref, params, plugin);
            case Structure.Size.Medium:
                return polymerAndLigand.apply(ref, params, plugin);
            case Structure.Size.Small:
                // `showCarbohydrateSymbol: true` is nice e.g. for PDB 1aga
                return atomicDetail.apply(ref, { ...params, showCarbohydrateSymbol: true }, plugin);
        }
    }
});

const empty = StructureRepresentationPresetProvider({
    id: 'preset-structure-representation-empty',
    display: { name: 'Empty', description: 'Removes all existing representations.' },
    async apply(ref, params, plugin) {
        return {  };
    }
});

const BuiltInPresetGroupName = 'Basic';

const polymerAndLigand = StructureRepresentationPresetProvider({
    id: 'preset-structure-representation-polymer-and-ligand',
    display: {
        name: 'Polymer & Ligand', group: BuiltInPresetGroupName,
        description: 'Shows polymers as Cartoon, ligands as Ball & Stick, carbohydrates as 3D-SNFG and water molecules semi-transparent.'
    },
    params: () => CommonParams,
    async apply(ref, params, plugin) {
        const structureCell = StateObjectRef.resolveAndCheck(plugin.state.data, ref);
        if (!structureCell) return {};

        const components = {
            polymer: await presetStaticComponent(plugin, structureCell, 'polymer'),
            ligand: await presetStaticComponent(plugin, structureCell, 'ligand'),
            nonStandard: await presetStaticComponent(plugin, structureCell, 'non-standard'),
            branched: await presetStaticComponent(plugin, structureCell, 'branched', { label: 'Carbohydrate' }),
            water: await presetStaticComponent(plugin, structureCell, 'water'),
            ion: await presetStaticComponent(plugin, structureCell, 'ion'),
            lipid: await presetStaticComponent(plugin, structureCell, 'lipid'),
            coarse: await presetStaticComponent(plugin, structureCell, 'coarse')
        };

        const structure = structureCell.obj!.data;
        const cartoonProps = {
            sizeFactor: structure.isCoarseGrained ? 0.8 : 0.2,
        };

        // TODO make configurable
        const waterType = (components.water?.obj?.data?.elementCount || 0) > 50_000 ? 'line' : 'ball-and-stick';
        const lipidType = (components.lipid?.obj?.data?.elementCount || 0) > 20_000 ? 'line' : 'ball-and-stick';

        const { update, builder, typeParams, color, ballAndStickColor } = reprBuilder(plugin, params);

        const representations = {
            polymer: builder.buildRepresentation(update, components.polymer, { type: 'cartoon', typeParams: { ...typeParams, ...cartoonProps }, color }, { tag: 'polymer' }),
            ligand: builder.buildRepresentation(update, components.ligand, { type: 'ball-and-stick', typeParams, color, colorParams: ballAndStickColor }, { tag: 'ligand' }),
            nonStandard: builder.buildRepresentation(update, components.nonStandard, { type: 'ball-and-stick', typeParams, color, colorParams: ballAndStickColor }, { tag: 'non-standard' }),
            branchedBallAndStick: builder.buildRepresentation(update, components.branched, { type: 'ball-and-stick', typeParams: { ...typeParams, alpha: 0.3 }, color, colorParams: ballAndStickColor }, { tag: 'branched-ball-and-stick' }),
            branchedSnfg3d: builder.buildRepresentation(update, components.branched, { type: 'carbohydrate', typeParams, color }, { tag: 'branched-snfg-3d' }),
            water: builder.buildRepresentation(update, components.water, { type: waterType, typeParams: { ...typeParams, alpha: 0.6 }, color, colorParams: { carbonColor: { name: 'element-symbol', params: {} } } }, { tag: 'water' }),
            ion: builder.buildRepresentation(update, components.ion, { type: 'ball-and-stick', typeParams, color, colorParams: { carbonColor: { name: 'element-symbol', params: {} } } }, { tag: 'ion' }),
            lipid: builder.buildRepresentation(update, components.lipid, { type: lipidType, typeParams: { ...typeParams, alpha: 0.6 }, color, colorParams: { carbonColor: { name: 'element-symbol', params: {} } } }, { tag: 'lipid' }),
            coarse: builder.buildRepresentation(update, components.coarse, { type: 'spacefill', typeParams, color: color || 'chain-id' }, { tag: 'coarse' })
        };

        await update.commit({ revertOnError: false });
        await updateFocusRepr(plugin, structure, params.theme?.focus?.name, params.theme?.focus?.params);

        return { components, representations };
    }
});

const proteinAndNucleic = StructureRepresentationPresetProvider({
    id: 'preset-structure-representation-protein-and-nucleic',
    display: {
        name: 'Protein & Nucleic', group: BuiltInPresetGroupName,
        description: 'Shows proteins as Cartoon and RNA/DNA as Gaussian Surface.'
    },
    params: () => CommonParams,
    async apply(ref, params, plugin) {
        const structureCell = StateObjectRef.resolveAndCheck(plugin.state.data, ref);
        if (!structureCell) return {};

        const components = {
            protein: await presetSelectionComponent(plugin, structureCell, 'protein'),
            nucleic: await presetSelectionComponent(plugin, structureCell, 'nucleic'),
        };

        const structure = structureCell.obj!.data;
        const cartoonProps = {
            sizeFactor: structure.isCoarseGrained ? 0.8 : 0.2,
        };
        const gaussianProps = {
            radiusOffset: structure.isCoarseGrained ? 2 : 0,
            smoothness: structure.isCoarseGrained ? 0.5 : 1.5,
        };

        const { update, builder, typeParams, color } = reprBuilder(plugin, params);
        const representations = {
            protein: builder.buildRepresentation(update, components.protein, { type: 'cartoon', typeParams: { ...typeParams, ...cartoonProps }, color }, { tag: 'protein' }),
            nucleic: builder.buildRepresentation(update, components.nucleic, { type: 'gaussian-surface', typeParams: { ...typeParams, ...gaussianProps }, color }, { tag: 'nucleic' })
        };

        await update.commit({ revertOnError: true });
        await updateFocusRepr(plugin, structure, params.theme?.focus?.name, params.theme?.focus?.params);

        return { components, representations };
    }
});

const coarseSurface = StructureRepresentationPresetProvider({
    id: 'preset-structure-representation-coarse-surface',
    display: {
        name: 'Coarse Surface', group: BuiltInPresetGroupName,
        description: 'Shows polymers as coarse Gaussian Surface.'
    },
    params: () => CommonParams,
    async apply(ref, params, plugin) {
        const structureCell = StateObjectRef.resolveAndCheck(plugin.state.data, ref);
        if (!structureCell) return {};

        const components = {
            polymer: await presetStaticComponent(plugin, structureCell, 'polymer')
        };

        const structure = structureCell.obj!.data;
        const size = Structure.getSize(structure);
        const gaussianProps = Object.create(null);
        if (size === Structure.Size.Gigantic) {
            Object.assign(gaussianProps, {
                traceOnly: true,
                radiusOffset: 2,
                smoothness: 0.5,
                visuals: ['structure-gaussian-surface-mesh']
            });
        } else if(size === Structure.Size.Huge) {
            Object.assign(gaussianProps, {
                radiusOffset: structure.isCoarseGrained ? 2 : 0,
                smoothness: 0.5,
            });
        } else if(structure.isCoarseGrained) {
            Object.assign(gaussianProps, {
                radiusOffset: 2,
                smoothness: 0.5,
            });
        }

        const { update, builder, typeParams, color } = reprBuilder(plugin, params);
        const representations = {
            polymer: builder.buildRepresentation(update, components.polymer, { type: 'gaussian-surface', typeParams: { ...typeParams, ...gaussianProps }, color }, { tag: 'polymer' })
        };

        await update.commit({ revertOnError: true });
        await updateFocusRepr(plugin, structure, params.theme?.focus?.name, params.theme?.focus?.params);

        return { components, representations };
    }
});

const polymerCartoon = StructureRepresentationPresetProvider({
    id: 'preset-structure-representation-polymer-cartoon',
    display: {
        name: 'Polymer Cartoon', group: BuiltInPresetGroupName,
        description: 'Shows polymers as Cartoon.'
    },
    params: () => CommonParams,
    async apply(ref, params, plugin) {
        const structureCell = StateObjectRef.resolveAndCheck(plugin.state.data, ref);
        if (!structureCell) return {};

        const components = {
            polymer: await presetStaticComponent(plugin, structureCell, 'polymer'),
        };

        const structure = structureCell.obj!.data;
        const cartoonProps = {
            sizeFactor: structure.isCoarseGrained ? 0.8 : 0.2
        };

        const { update, builder, typeParams, color } = reprBuilder(plugin, params);
        const representations = {
            polymer: builder.buildRepresentation(update, components.polymer, { type: 'cartoon', typeParams: { ...typeParams, ...cartoonProps }, color }, { tag: 'polymer' })
        };

        await update.commit({ revertOnError: true });
        await updateFocusRepr(plugin, structure, params.theme?.focus?.name, params.theme?.focus?.params);

        return { components, representations };
    }
});

const atomicDetail = StructureRepresentationPresetProvider({
    id: 'preset-structure-representation-atomic-detail',
    display: {
        name: 'Atomic Detail', group: BuiltInPresetGroupName,
        description: 'Shows everything in atomic detail with Ball & Stick.'
    },
    params: () => ({
        ...CommonParams,
        showCarbohydrateSymbol: PD.Boolean(false)
    }),
    async apply(ref, params, plugin) {
        const structureCell = StateObjectRef.resolveAndCheck(plugin.state.data, ref);
        if (!structureCell) return {};

        const components = {
            all: await presetStaticComponent(plugin, structureCell, 'all'),
            branched: undefined
        };

        const structure = structureCell.obj!.data;
        const highElementCount = structure.elementCount > 100_000; // TODO make configurable
        const lowResidueElementRatio = structure.atomicResidueCount &&
            structure.elementCount > 1000 &&
            structure.atomicResidueCount / structure.elementCount < 3;

        const atomicType = lowResidueElementRatio ? 'spacefill' :
            highElementCount ? 'line' : 'ball-and-stick';
        const showCarbohydrateSymbol = params.showCarbohydrateSymbol && !highElementCount && !lowResidueElementRatio;

        if (showCarbohydrateSymbol) {
            Object.assign(components, {
                branched: await presetStaticComponent(plugin, structureCell, 'branched', { label: 'Carbohydrate' }),
            });
        }

        const { update, builder, typeParams, color, ballAndStickColor } = reprBuilder(plugin, params);
        const colorParams = lowResidueElementRatio
            ? { carbonColor: { name: 'element-symbol', params: {} } }
            : ballAndStickColor;

        const representations = {
            all: builder.buildRepresentation(update, components.all, { type: atomicType, typeParams, color, colorParams }, { tag: 'all' }),
        };
        if (showCarbohydrateSymbol) {
            Object.assign(representations, {
                snfg3d: builder.buildRepresentation(update, components.branched, { type: 'carbohydrate', typeParams: { ...typeParams, alpha: 0.4, visuals: ['carbohydrate-symbol'] }, color }, { tag: 'snfg-3d' }),
            });
        }

        await update.commit({ revertOnError: true });
        return { components, representations };
    }
});

export function presetStaticComponent(plugin: PluginContext, structure: StateObjectRef<PluginStateObject.Molecule.Structure>, type: StaticStructureComponentType, params?: { label?: string, tags?: string[] }) {
    return plugin.builders.structure.tryCreateComponentStatic(structure, type, params);
}

export function presetSelectionComponent(plugin: PluginContext, structure: StateObjectRef<PluginStateObject.Molecule.Structure>, query: keyof typeof Q, params?: { label?: string, tags?: string[] }) {
    return plugin.builders.structure.tryCreateComponentFromSelection(structure, Q[query], `selection-${query}`, params);
}

export const PresetStructureRepresentations = {
    empty,
    auto,
    'atomic-detail': atomicDetail,
    'polymer-cartoon': polymerCartoon,
    'polymer-and-ligand': polymerAndLigand,
    'protein-and-nucleic': proteinAndNucleic,
    'coarse-surface': coarseSurface
};
export type PresetStructureRepresentations = typeof PresetStructureRepresentations;