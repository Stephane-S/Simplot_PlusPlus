import { DataRenderer } from "../renderers/data_renderer";
export declare type RendererSpec = DataRenderer[] | "auto" | null;
export declare function compute_renderers(renderers: RendererSpec, all_renderers: DataRenderer[], names: string[]): DataRenderer[];
