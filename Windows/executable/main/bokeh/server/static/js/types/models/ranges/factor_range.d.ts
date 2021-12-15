import { Range } from "./range";
import { PaddingUnits } from "../../core/enums";
import * as p from "../../core/properties";
import { Arrayable, NumberArray } from "../../core/types";
export declare type L1Factor = string;
export declare type L2Factor = [string, string];
export declare type L3Factor = [string, string, string];
export declare type Factor = L1Factor | L2Factor | L3Factor;
export declare type BoxedFactor = [string] | L2Factor | L3Factor;
export declare type L1Factors = Arrayable<L1Factor>;
export declare type L2Factors = Arrayable<L2Factor>;
export declare type L3Factors = Arrayable<L3Factor>;
export declare type Factors = L1Factors | L2Factors | L3Factors;
export declare type L1OffsetFactor = [string, number];
export declare type L2OffsetFactor = [string, string, number];
export declare type L3OffsetFactor = [string, string, string, number];
export declare type OffsetFactor = L1OffsetFactor | L2OffsetFactor | L3OffsetFactor;
export declare type L1Mapping = Map<string, {
    value: number;
}>;
export declare type L2Mapping = Map<string, {
    value: number;
    mapping: L1Mapping;
}>;
export declare type L3Mapping = Map<string, {
    value: number;
    mapping: L2Mapping;
}>;
export declare type Mapping = L1Mapping | L2Mapping | L3Mapping;
export declare function map_one_level(factors: L1Factor[], padding: number, offset?: number): [L1Mapping, number];
export declare function map_two_levels(factors: L2Factor[], outer_pad: number, factor_pad: number, offset?: number): [L2Mapping, number];
export declare function map_three_levels(factors: L3Factor[], outer_pad: number, inner_pad: number, factor_pad: number, offset?: number): [L3Mapping, number];
export declare namespace FactorRange {
    type Attrs = p.AttrsOf<Props>;
    type Props = Range.Props & {
        factors: p.Property<Factor[]>;
        factor_padding: p.Property<number>;
        subgroup_padding: p.Property<number>;
        group_padding: p.Property<number>;
        range_padding: p.Property<number>;
        range_padding_units: p.Property<PaddingUnits>;
        start: p.Property<number>;
        end: p.Property<number>;
        levels: p.Property<number>;
        mids: p.Property<[string, string][] | null>;
        tops: p.Property<string[] | null>;
    };
}
export interface FactorRange extends FactorRange.Attrs {
}
export declare class FactorRange extends Range {
    properties: FactorRange.Props;
    constructor(attrs?: Partial<FactorRange.Attrs>);
    static init_FactorRange(): void;
    protected _mapping: Mapping;
    get min(): number;
    get max(): number;
    initialize(): void;
    connect_signals(): void;
    reset(): void;
    protected _lookup(x: BoxedFactor): number;
    synthetic(x: number | Factor | [string] | OffsetFactor): number;
    v_synthetic(xs: Arrayable<number | Factor | [string] | OffsetFactor>): NumberArray;
    protected _init(silent: boolean): void;
}
