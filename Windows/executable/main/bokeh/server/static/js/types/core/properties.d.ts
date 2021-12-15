import { Signal0 } from "./signaling";
import type { HasProps } from "./has_props";
import * as enums from "./enums";
import { Arrayable, NumberArray, ColorArray } from "./types";
import * as types from "./types";
import { Factor } from "../models/ranges/factor_range";
import { ColumnarDataSource } from "../models/sources/columnar_data_source";
import { Scalar, Vector, Dimensional } from "./vectorization";
import { Kind } from "./kinds";
export declare function isSpec(obj: any): boolean;
export declare type AttrsOf<P> = {
    [K in keyof P]: P[K] extends Property<infer T> ? T : never;
};
export declare type DefineOf<P> = {
    [K in keyof P]: P[K] extends Property<infer T> ? [PropertyConstructor<T> | Kind<T>, (T | (() => T))?, PropertyOptions?] : never;
};
export declare type PropertyOptions = {
    internal?: boolean;
    optional?: boolean;
};
export interface PropertyConstructor<T> {
    new (obj: HasProps, attr: string, kind: Kind<T>, default_value?: (obj: HasProps) => T, initial_value?: T, options?: PropertyOptions): Property<T>;
    readonly prototype: Property<T>;
}
export declare abstract class Property<T = unknown> {
    readonly obj: HasProps;
    readonly attr: string;
    readonly kind: Kind<T>;
    readonly default_value?: ((obj: HasProps) => T) | undefined;
    __value__: T;
    get is_value(): boolean;
    get syncable(): boolean;
    spec: {
        readonly value?: any;
        readonly field?: string;
        readonly expr?: any;
        readonly transform?: any;
        units?: any;
    };
    get_value(): T;
    set_value(val: T): void;
    _default_override(): T | undefined;
    private _dirty;
    get dirty(): boolean;
    readonly change: Signal0<HasProps>;
    internal: boolean;
    readonly optional: boolean;
    constructor(obj: HasProps, attr: string, kind: Kind<T>, default_value?: ((obj: HasProps) => T) | undefined, initial_value?: T, options?: PropertyOptions);
    protected _update(attr_value: T): void;
    toString(): string;
    normalize(values: any): any;
    validate(value: any): void;
    valid(value: unknown): boolean;
    value(do_spec_transform?: boolean): any;
}
export declare class PrimitiveProperty<T> extends Property<T> {
}
export declare class Any extends Property<any> {
}
export declare class Array extends Property<any[]> {
    valid(value: unknown): boolean;
}
export declare class Boolean extends Property<boolean> {
    valid(value: unknown): boolean;
}
export declare class Color extends Property<types.Color> {
    valid(value: unknown): boolean;
}
export declare class Instance extends Property<any> {
}
export declare class Number extends Property<number> {
    valid(value: unknown): boolean;
}
export declare class Int extends Number {
    valid(value: unknown): boolean;
}
export declare class Angle extends Number {
}
export declare class Percent extends Number {
    valid(value: unknown): boolean;
}
export declare class String extends Property<string> {
    valid(value: unknown): boolean;
}
export declare class NullString extends Property<string | null> {
    valid(value: unknown): boolean;
}
export declare class FontSize extends String {
}
export declare class Font extends String {
    _default_override(): string | undefined;
}
export declare abstract class EnumProperty<T extends string> extends Property<T> {
    readonly enum_values: T[];
    valid(value: unknown): boolean;
}
export declare function Enum<T extends string>(values: Iterable<T>): PropertyConstructor<T>;
export declare class Direction extends EnumProperty<enums.Direction> {
    get enum_values(): enums.Direction[];
    normalize(values: any): any;
}
export declare const Anchor: PropertyConstructor<"center" | "top_left" | "top_center" | "top_right" | "center_left" | "center_right" | "bottom_left" | "bottom_center" | "bottom_right">;
export declare const AngleUnits: PropertyConstructor<"deg" | "rad">;
export declare const BoxOrigin: PropertyConstructor<"center" | "corner">;
export declare const ButtonType: PropertyConstructor<"default" | "primary" | "success" | "warning" | "danger">;
export declare const CalendarPosition: PropertyConstructor<"auto" | "above" | "below">;
export declare const Dimension: PropertyConstructor<"width" | "height">;
export declare const Dimensions: PropertyConstructor<"width" | "height" | "both">;
export declare const Distribution: PropertyConstructor<"uniform" | "normal">;
export declare const FontStyle: PropertyConstructor<"bold" | "normal" | "italic" | "bold italic">;
export declare const HatchPatternType: PropertyConstructor<"," | "blank" | "dot" | "ring" | "horizontal_line" | "vertical_line" | "cross" | "horizontal_dash" | "vertical_dash" | "spiral" | "right_diagonal_line" | "left_diagonal_line" | "diagonal_cross" | "right_diagonal_dash" | "left_diagonal_dash" | "horizontal_wave" | "vertical_wave" | "criss_cross" | " " | "." | "o" | "-" | "|" | "+" | "\"" | ":" | "@" | "/" | "\\" | "x" | "`" | "v" | ">" | "*">;
export declare const HTTPMethod: PropertyConstructor<"POST" | "GET">;
export declare const HexTileOrientation: PropertyConstructor<"pointytop" | "flattop">;
export declare const HoverMode: PropertyConstructor<"mouse" | "hline" | "vline">;
export declare const LatLon: PropertyConstructor<"lat" | "lon">;
export declare const LegendClickPolicy: PropertyConstructor<"none" | "hide" | "mute">;
export declare const LegendLocation: PropertyConstructor<"center" | "top_left" | "top_center" | "top_right" | "center_left" | "center_right" | "bottom_left" | "bottom_center" | "bottom_right">;
export declare const LineCap: PropertyConstructor<"butt" | "round" | "square">;
export declare const LineJoin: PropertyConstructor<"round" | "miter" | "bevel">;
export declare const LinePolicy: PropertyConstructor<"none" | "prev" | "next" | "nearest" | "interp">;
export declare const Location: PropertyConstructor<"above" | "below" | "left" | "right">;
export declare const Logo: PropertyConstructor<"grey" | "normal">;
export declare const MarkerType: PropertyConstructor<"dot" | "cross" | "x" | "square" | "asterisk" | "circle" | "circle_cross" | "circle_dot" | "circle_x" | "circle_y" | "dash" | "diamond" | "diamond_cross" | "diamond_dot" | "hex" | "hex_dot" | "inverted_triangle" | "plus" | "square_cross" | "square_dot" | "square_pin" | "square_x" | "triangle" | "triangle_dot" | "triangle_pin" | "y">;
export declare const MutedPolicy: PropertyConstructor<"show" | "ignore">;
export declare const Orientation: PropertyConstructor<"vertical" | "horizontal">;
export declare const OutputBackend: PropertyConstructor<"canvas" | "svg" | "webgl">;
export declare const PaddingUnits: PropertyConstructor<"percent" | "absolute">;
export declare const Place: PropertyConstructor<"center" | "above" | "below" | "left" | "right">;
export declare const PointPolicy: PropertyConstructor<"none" | "snap_to_data" | "follow_mouse">;
export declare const RadiusDimension: PropertyConstructor<"max" | "x" | "y" | "min">;
export declare const RenderLevel: PropertyConstructor<"image" | "underlay" | "glyph" | "guide" | "annotation" | "overlay">;
export declare const RenderMode: PropertyConstructor<"canvas" | "css">;
export declare const ResetPolicy: PropertyConstructor<"standard" | "event_only">;
export declare const RoundingFunction: PropertyConstructor<"ceil" | "round" | "nearest" | "floor" | "rounddown" | "roundup">;
export declare const Side: PropertyConstructor<"above" | "below" | "left" | "right">;
export declare const SizingMode: PropertyConstructor<"fixed" | "stretch_width" | "stretch_height" | "stretch_both" | "scale_width" | "scale_height" | "scale_both">;
export declare const Sort: PropertyConstructor<"ascending" | "descending">;
export declare const SpatialUnits: PropertyConstructor<"screen" | "data">;
export declare const StartEnd: PropertyConstructor<"start" | "end">;
export declare const StepMode: PropertyConstructor<"center" | "after" | "before">;
export declare const TapBehavior: PropertyConstructor<"select" | "inspect">;
export declare const TextAlign: PropertyConstructor<"center" | "left" | "right">;
export declare const TextBaseline: PropertyConstructor<"top" | "middle" | "bottom" | "alphabetic" | "hanging" | "ideographic">;
export declare const TextureRepetition: PropertyConstructor<"repeat" | "repeat_x" | "repeat_y" | "no_repeat">;
export declare const TickLabelOrientation: PropertyConstructor<"normal" | "vertical" | "horizontal" | "parallel">;
export declare const TooltipAttachment: PropertyConstructor<"above" | "below" | "left" | "right" | "vertical" | "horizontal">;
export declare const UpdateMode: PropertyConstructor<"replace" | "append">;
export declare const VerticalAlign: PropertyConstructor<"top" | "middle" | "bottom">;
export declare class ScalarSpec<T, S extends Scalar<T> = Scalar<T>> extends Property<T | S> {
    __value__: T;
    __scalar__: S;
    get_value(): S;
    protected _update(attr_value: S | T): void;
}
export declare class AnyScalar extends ScalarSpec<any> {
}
export declare class ColorScalar extends ScalarSpec<types.Color | null> {
}
export declare class NumberScalar extends ScalarSpec<number> {
}
export declare class StringScalar extends ScalarSpec<string> {
}
export declare class NullStringScalar extends ScalarSpec<string | null> {
}
export declare class ArrayScalar extends ScalarSpec<any[]> {
}
export declare class LineJoinScalar extends ScalarSpec<enums.LineJoin> {
}
export declare class LineCapScalar extends ScalarSpec<enums.LineCap> {
}
export declare class FontSizeScalar extends ScalarSpec<string> {
}
export declare class FontStyleScalar extends ScalarSpec<enums.FontStyle> {
}
export declare class TextAlignScalar extends ScalarSpec<enums.TextAlign> {
}
export declare class TextBaselineScalar extends ScalarSpec<enums.TextBaseline> {
}
export declare abstract class VectorSpec<T, V extends Vector<T> = Vector<T>> extends Property<T | V> {
    __value__: T;
    __vector__: V;
    get_value(): V;
    protected _update(attr_value: V | T): void;
    array(source: ColumnarDataSource): Arrayable<unknown>;
}
export declare abstract class DataSpec<T> extends VectorSpec<T> {
}
export declare abstract class UnitsSpec<T, Units> extends VectorSpec<T, Dimensional<Vector<T>, Units>> {
    readonly default_units: Units;
    readonly valid_units: Units[];
    _update(attr_value: any): void;
    get units(): Units;
    set units(units: Units);
}
export declare abstract class NumberUnitsSpec<Units> extends UnitsSpec<number, Units> {
    array(source: ColumnarDataSource): NumberArray;
}
export declare abstract class BaseCoordinateSpec<T> extends DataSpec<T> {
    readonly dimension: "x" | "y";
}
export declare abstract class CoordinateSpec extends BaseCoordinateSpec<number | Factor> {
}
export declare abstract class CoordinateSeqSpec extends BaseCoordinateSpec<Arrayable<number> | Arrayable<Factor>> {
}
export declare abstract class CoordinateSeqSeqSeqSpec extends BaseCoordinateSpec<number[][][] | Factor[][][]> {
}
export declare class XCoordinateSpec extends CoordinateSpec {
    readonly dimension = "x";
}
export declare class YCoordinateSpec extends CoordinateSpec {
    readonly dimension = "y";
}
export declare class XCoordinateSeqSpec extends CoordinateSeqSpec {
    readonly dimension = "x";
}
export declare class YCoordinateSeqSpec extends CoordinateSeqSpec {
    readonly dimension = "y";
}
export declare class XCoordinateSeqSeqSeqSpec extends CoordinateSeqSeqSeqSpec {
    readonly dimension = "x";
}
export declare class YCoordinateSeqSeqSeqSpec extends CoordinateSeqSeqSeqSpec {
    readonly dimension = "y";
}
export declare class AngleSpec extends NumberUnitsSpec<enums.AngleUnits> {
    get default_units(): enums.AngleUnits;
    get valid_units(): enums.AngleUnits[];
    normalize(values: Arrayable): Arrayable;
}
export declare class DistanceSpec extends NumberUnitsSpec<enums.SpatialUnits> {
    get default_units(): enums.SpatialUnits;
    get valid_units(): enums.SpatialUnits[];
}
export declare class BooleanSpec extends DataSpec<boolean> {
    array(source: ColumnarDataSource): Uint8Array;
}
export declare class NumberSpec extends DataSpec<number> {
    array(source: ColumnarDataSource): NumberArray;
}
export declare class ColorSpec extends DataSpec<types.Color | null> {
    array(source: ColumnarDataSource): ColorArray;
}
export declare class FontSizeSpec extends DataSpec<string> {
}
export declare class MarkerSpec extends DataSpec<string> {
}
export declare class StringSpec extends DataSpec<string> {
}
export declare class NullStringSpec extends DataSpec<string | null> {
}
export declare class NDArraySpec extends DataSpec<number> {
}
