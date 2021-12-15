import { ActionTool, ActionToolView } from "./action_tool";
import { bk_tool_icon_save } from "../../../styles/icons";
export class SaveToolView extends ActionToolView {
    async copy() {
        const blob = await this.plot_view.to_blob();
        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);
    }
    async save(name) {
        const blob = await this.plot_view.to_blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = name; // + ".png" | "svg" (inferred from MIME type)
        link.target = "_blank";
        link.dispatchEvent(new MouseEvent("click"));
    }
    doit(action = "save") {
        switch (action) {
            case "save":
                this.save("bokeh_plot");
                break;
            case "copy":
                this.copy();
                break;
        }
    }
}
SaveToolView.__name__ = "SaveToolView";
export class SaveTool extends ActionTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Save";
        this.icon = bk_tool_icon_save;
    }
    static init_SaveTool() {
        this.prototype.default_view = SaveToolView;
        this.register_alias("save", () => new SaveTool());
    }
    get menu() {
        return [
            {
                icon: "bk-tool-icon-copy-to-clipboard",
                tooltip: "Copy image to clipboard",
                if: () => typeof ClipboardItem !== "undefined",
                handler: () => {
                    this.do.emit("copy");
                },
            },
        ];
    }
}
SaveTool.__name__ = "SaveTool";
SaveTool.init_SaveTool();
//# sourceMappingURL=save_tool.js.map