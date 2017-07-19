import { Config } from './../config';
import { AnyMark } from './../mark';
import { GenericUnitSpec, LayerSpec } from './../spec';
import { BOXPLOT, BoxPlotConfigMixins, BoxPlotDef } from './boxplot';
import { ERRORBAR } from './errorbar';
export { BoxPlotConfig } from './boxplot';
export declare type UnitNormalizer = (spec: GenericUnitSpec<any, any>, config: Config) => LayerSpec;
export declare function add(mark: string, normalizer: UnitNormalizer): void;
export declare function remove(mark: string): void;
export declare type CompositeMark = BOXPLOT | ERRORBAR;
export declare type CompositeMarkDef = BoxPlotDef;
export declare type CompositeAggregate = BOXPLOT;
export declare const COMPOSITE_MARK_ROLES: ("box" | "boxWhisker" | "boxMid")[];
export interface CompositeMarkConfigMixins extends BoxPlotConfigMixins {
}
export declare const VL_ONLY_COMPOSITE_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX: {
    box?: ("font" | "text" | "color" | "opacity" | "size" | "shape" | "interpolate" | "stroke" | "strokeWidth" | "strokeDash" | "strokeDashOffset" | "strokeOpacity" | "fill" | "fillOpacity" | "filled" | "clip" | "orient" | "tension" | "align" | "angle" | "baseline" | "dx" | "dy" | "radius" | "theta" | "fontSize" | "fontStyle" | "fontWeight")[];
    boxWhisker?: ("font" | "text" | "color" | "opacity" | "size" | "shape" | "interpolate" | "stroke" | "strokeWidth" | "strokeDash" | "strokeDashOffset" | "strokeOpacity" | "fill" | "fillOpacity" | "filled" | "clip" | "orient" | "tension" | "align" | "angle" | "baseline" | "dx" | "dy" | "radius" | "theta" | "fontSize" | "fontStyle" | "fontWeight")[];
    boxMid?: ("font" | "text" | "color" | "opacity" | "size" | "shape" | "interpolate" | "stroke" | "strokeWidth" | "strokeDash" | "strokeDashOffset" | "strokeOpacity" | "fill" | "fillOpacity" | "filled" | "clip" | "orient" | "tension" | "align" | "angle" | "baseline" | "dx" | "dy" | "radius" | "theta" | "fontSize" | "fontStyle" | "fontWeight")[];
};
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
export declare function normalize(spec: GenericUnitSpec<any, AnyMark>, config: Config): LayerSpec;
