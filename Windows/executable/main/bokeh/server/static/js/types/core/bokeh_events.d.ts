import { HasProps } from "./has_props";
import { GeometryData } from "./geometry";
export declare type JSON = {
    [key: string]: unknown;
};
export declare type EventJSON = {
    event_name: string;
    event_values: JSON;
};
export declare abstract class BokehEvent {
    event_name: string;
    to_json(): EventJSON;
    protected abstract _to_json(): JSON;
}
export declare abstract class ModelEvent extends BokehEvent {
    origin: HasProps | null;
    protected _to_json(): JSON;
}
export declare class DocumentReady extends BokehEvent {
    protected _to_json(): JSON;
}
export declare class ButtonClick extends ModelEvent {
}
export declare class MenuItemClick extends ModelEvent {
    readonly item: string;
    constructor(item: string);
    protected _to_json(): JSON;
}
export declare abstract class UIEvent extends ModelEvent {
}
export declare class LODStart extends UIEvent {
}
export declare class LODEnd extends UIEvent {
}
export declare class SelectionGeometry extends UIEvent {
    readonly geometry: GeometryData;
    readonly final: boolean;
    constructor(geometry: GeometryData, final: boolean);
    protected _to_json(): JSON;
}
export declare class Reset extends UIEvent {
}
export declare abstract class PointEvent extends UIEvent {
    readonly sx: number;
    readonly sy: number;
    readonly x: number;
    readonly y: number;
    constructor(sx: number, sy: number, x: number, y: number);
    protected _to_json(): JSON;
}
export declare class Pan extends PointEvent {
    readonly sx: number;
    readonly sy: number;
    readonly x: number;
    readonly y: number;
    readonly delta_x: number;
    readonly delta_y: number;
    constructor(sx: number, sy: number, x: number, y: number, delta_x: number, delta_y: number);
    protected _to_json(): JSON;
}
export declare class Pinch extends PointEvent {
    readonly sx: number;
    readonly sy: number;
    readonly x: number;
    readonly y: number;
    readonly scale: number;
    constructor(sx: number, sy: number, x: number, y: number, scale: number);
    protected _to_json(): JSON;
}
export declare class Rotate extends PointEvent {
    readonly sx: number;
    readonly sy: number;
    readonly x: number;
    readonly y: number;
    readonly rotation: number;
    constructor(sx: number, sy: number, x: number, y: number, rotation: number);
    protected _to_json(): JSON;
}
export declare class MouseWheel extends PointEvent {
    readonly sx: number;
    readonly sy: number;
    readonly x: number;
    readonly y: number;
    readonly delta: number;
    constructor(sx: number, sy: number, x: number, y: number, delta: number);
    protected _to_json(): JSON;
}
export declare class MouseMove extends PointEvent {
}
export declare class MouseEnter extends PointEvent {
}
export declare class MouseLeave extends PointEvent {
}
export declare class Tap extends PointEvent {
}
export declare class DoubleTap extends PointEvent {
}
export declare class Press extends PointEvent {
}
export declare class PressUp extends PointEvent {
}
export declare class PanStart extends PointEvent {
}
export declare class PanEnd extends PointEvent {
}
export declare class PinchStart extends PointEvent {
}
export declare class PinchEnd extends PointEvent {
}
export declare class RotateStart extends PointEvent {
}
export declare class RotateEnd extends PointEvent {
}
