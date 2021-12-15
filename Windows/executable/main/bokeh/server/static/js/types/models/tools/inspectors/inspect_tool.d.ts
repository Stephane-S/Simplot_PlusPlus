import { ButtonTool, ButtonToolView } from "../button_tool";
import * as p from "../../../core/properties";
export declare abstract class InspectToolView extends ButtonToolView {
    model: InspectTool;
}
export declare namespace InspectTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = ButtonTool.Props & {
        toggleable: p.Property<boolean>;
    };
}
export interface InspectTool extends InspectTool.Attrs {
}
export declare abstract class InspectTool extends ButtonTool {
    properties: InspectTool.Props;
    __view_type__: InspectToolView;
    constructor(attrs?: Partial<InspectTool.Attrs>);
    static init_InspectTool(): void;
    event_type: "move";
}
