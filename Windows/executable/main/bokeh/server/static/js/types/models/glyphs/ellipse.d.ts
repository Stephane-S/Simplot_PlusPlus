import { EllipseOval, EllipseOvalView, EllipseOvalData } from "./ellipse_oval";
import { LineVector, FillVector } from "../../core/property_mixins";
import * as p from "../../core/properties";
export interface EllipseData extends EllipseOvalData {
}
export interface EllipseView extends EllipseData {
}
export declare class EllipseView extends EllipseOvalView {
    model: Ellipse;
    visuals: Ellipse.Visuals;
}
export declare namespace Ellipse {
    type Attrs = p.AttrsOf<Props>;
    type Props = EllipseOval.Props & LineVector & FillVector;
    type Visuals = EllipseOval.Visuals;
}
export interface Ellipse extends Ellipse.Attrs {
}
export declare class Ellipse extends EllipseOval {
    properties: Ellipse.Props;
    __view_type__: EllipseView;
    constructor(attrs?: Partial<Ellipse.Attrs>);
    static init_Ellipse(): void;
}
