import { LayoutDOM, Plot } from "./models";
import { SizingMode, Location } from "../core/enums";
import { Matrix } from "../core/util/data_structures";
export interface GridPlotOpts {
    toolbar_location?: Location | null;
    merge_tools?: boolean;
    sizing_mode?: SizingMode;
    plot_width?: number;
    plot_height?: number;
}
export declare function gridplot(children: (Plot | null)[][] | Matrix<Plot | null>, options?: GridPlotOpts): LayoutDOM;
