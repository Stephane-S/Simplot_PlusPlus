import { ButtonTool, ButtonToolView } from "../button_tool";
import { OnOffButtonView } from "../on_off_button";
import * as p from "../../../core/properties";
export declare abstract class GestureToolView extends ButtonToolView {
    model: GestureTool;
}
export declare namespace GestureTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = ButtonTool.Props;
}
export interface GestureTool extends GestureTool.Attrs {
}
export declare abstract class GestureTool extends ButtonTool {
    properties: GestureTool.Props;
    __view_type__: GestureToolView;
    constructor(attrs?: Partial<GestureTool.Attrs>);
    button_view: typeof OnOffButtonView;
    default_order: number;
}
