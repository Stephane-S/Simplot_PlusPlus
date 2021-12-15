import { Model } from "../../model";
import { DOMView } from "../../core/dom_view";
import * as p from "../../core/properties";
export declare abstract class AbstractIconView extends DOMView {
    model: AbstractIcon;
}
export declare namespace AbstractIcon {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props;
}
export interface AbstractIcon extends AbstractIcon.Attrs {
}
export declare abstract class AbstractIcon extends Model {
    properties: AbstractIcon.Props;
    __view_type__: AbstractIconView;
    constructor(attrs?: Partial<AbstractIcon.Attrs>);
}
