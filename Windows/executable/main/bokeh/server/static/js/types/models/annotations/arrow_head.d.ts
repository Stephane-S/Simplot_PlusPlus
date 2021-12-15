import { Annotation } from "./annotation";
import { Visuals, Line, Fill } from "../../core/visuals";
import { LineVector, FillVector } from "../../core/property_mixins";
import * as p from "../../core/properties";
import { Context2d } from "../../core/util/canvas";
export declare namespace ArrowHead {
    type Attrs = p.AttrsOf<Props>;
    type Props = Annotation.Props & {
        size: p.Property<number>;
    };
}
export interface ArrowHead extends ArrowHead.Attrs {
}
export declare abstract class ArrowHead extends Annotation {
    properties: ArrowHead.Props;
    constructor(attrs?: Partial<ArrowHead.Attrs>);
    static init_ArrowHead(): void;
    visuals: Visuals;
    initialize(): void;
    abstract render(ctx: Context2d, i: number): void;
    abstract clip(ctx: Context2d, i: number): void;
}
export declare namespace OpenHead {
    type Attrs = p.AttrsOf<Props>;
    type Props = ArrowHead.Props & Mixins;
    type Mixins = LineVector;
}
export interface OpenHead extends OpenHead.Attrs {
}
export declare class OpenHead extends ArrowHead {
    properties: OpenHead.Props;
    constructor(attrs?: Partial<OpenHead.Attrs>);
    static init_OpenHead(): void;
    visuals: Visuals & {
        line: Line;
    };
    clip(ctx: Context2d, i: number): void;
    render(ctx: Context2d, i: number): void;
}
export declare namespace NormalHead {
    type Attrs = p.AttrsOf<Props>;
    type Props = ArrowHead.Props & Mixins;
    type Mixins = LineVector & FillVector;
}
export interface NormalHead extends NormalHead.Attrs {
}
export declare class NormalHead extends ArrowHead {
    properties: NormalHead.Props;
    constructor(attrs?: Partial<NormalHead.Attrs>);
    static init_NormalHead(): void;
    visuals: Visuals & {
        line: Line;
        fill: Fill;
    };
    clip(ctx: Context2d, i: number): void;
    render(ctx: Context2d, i: number): void;
    _normal(ctx: Context2d, _i: number): void;
}
export declare namespace VeeHead {
    type Attrs = p.AttrsOf<Props>;
    type Props = ArrowHead.Props & Mixins;
    type Mixins = LineVector & FillVector;
}
export interface VeeHead extends VeeHead.Attrs {
}
export declare class VeeHead extends ArrowHead {
    properties: VeeHead.Props;
    constructor(attrs?: Partial<VeeHead.Attrs>);
    static init_VeeHead(): void;
    visuals: Visuals & {
        line: Line;
        fill: Fill;
    };
    clip(ctx: Context2d, i: number): void;
    render(ctx: Context2d, i: number): void;
    _vee(ctx: Context2d, _i: number): void;
}
export declare namespace TeeHead {
    type Attrs = p.AttrsOf<Props>;
    type Props = ArrowHead.Props & Mixins;
    type Mixins = LineVector;
}
export interface TeeHead extends TeeHead.Attrs {
}
export declare class TeeHead extends ArrowHead {
    properties: TeeHead.Props;
    constructor(attrs?: Partial<TeeHead.Attrs>);
    static init_TeeHead(): void;
    visuals: Visuals & {
        line: Line;
    };
    render(ctx: Context2d, i: number): void;
    clip(_ctx: Context2d, _i: number): void;
}
