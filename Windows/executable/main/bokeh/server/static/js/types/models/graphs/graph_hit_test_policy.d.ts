import { Model } from "../../model";
import { HitTestResult } from "../../core/hittest";
import { Geometry } from "../../core/geometry";
import { SelectionMode } from "../../core/enums";
import * as p from "../../core/properties";
import { Selection } from "../selections/selection";
import { GraphRenderer, GraphRendererView } from "../renderers/graph_renderer";
import { ColumnarDataSource } from "../sources/columnar_data_source";
export declare namespace GraphHitTestPolicy {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props;
}
export interface GraphHitTestPolicy extends Model.Attrs {
}
export declare abstract class GraphHitTestPolicy extends Model {
    properties: GraphHitTestPolicy.Props;
    constructor(attrs?: Partial<GraphHitTestPolicy.Attrs>);
    abstract hit_test(geometry: Geometry, graph_view: GraphRendererView): HitTestResult;
    abstract do_selection(hit_test_result: HitTestResult, graph: GraphRenderer, final: boolean, mode: SelectionMode): boolean;
    abstract do_inspection(hit_test_result: HitTestResult, geometry: Geometry, graph_view: GraphRendererView, final: boolean, mode: SelectionMode): boolean;
    _hit_test_nodes(geometry: Geometry, graph_view: GraphRendererView): HitTestResult;
    _hit_test_edges(geometry: Geometry, graph_view: GraphRendererView): HitTestResult;
}
export declare namespace NodesOnly {
    type Attrs = p.AttrsOf<Props>;
    type Props = GraphHitTestPolicy.Props;
}
export interface NodesOnly extends NodesOnly.Attrs {
}
export declare class NodesOnly extends GraphHitTestPolicy {
    properties: NodesOnly.Props;
    constructor(attrs?: Partial<NodesOnly.Attrs>);
    hit_test(geometry: Geometry, graph_view: GraphRendererView): HitTestResult;
    do_selection(hit_test_result: HitTestResult, graph: GraphRenderer, final: boolean, mode: SelectionMode): boolean;
    do_inspection(hit_test_result: HitTestResult, geometry: Geometry, graph_view: GraphRendererView, final: boolean, mode: SelectionMode): boolean;
}
export declare namespace NodesAndLinkedEdges {
    type Attrs = p.AttrsOf<Props>;
    type Props = GraphHitTestPolicy.Props;
}
export interface NodesAndLinkedEdges extends NodesAndLinkedEdges.Attrs {
}
export declare class NodesAndLinkedEdges extends GraphHitTestPolicy {
    properties: NodesAndLinkedEdges.Props;
    constructor(attrs?: Partial<NodesAndLinkedEdges.Attrs>);
    hit_test(geometry: Geometry, graph_view: GraphRendererView): HitTestResult;
    get_linked_edges(node_source: ColumnarDataSource, edge_source: ColumnarDataSource, mode: string): Selection;
    do_selection(hit_test_result: HitTestResult, graph: GraphRenderer, final: boolean, mode: SelectionMode): boolean;
    do_inspection(hit_test_result: HitTestResult, geometry: Geometry, graph_view: GraphRendererView, final: boolean, mode: SelectionMode): boolean;
}
export declare namespace EdgesAndLinkedNodes {
    type Attrs = p.AttrsOf<Props>;
    type Props = GraphHitTestPolicy.Props;
}
export interface EdgesAndLinkedNodes extends EdgesAndLinkedNodes.Attrs {
}
export declare class EdgesAndLinkedNodes extends GraphHitTestPolicy {
    properties: EdgesAndLinkedNodes.Props;
    constructor(attrs?: Partial<EdgesAndLinkedNodes.Attrs>);
    hit_test(geometry: Geometry, graph_view: GraphRendererView): HitTestResult;
    get_linked_nodes(node_source: ColumnarDataSource, edge_source: ColumnarDataSource, mode: string): Selection;
    do_selection(hit_test_result: HitTestResult, graph: GraphRenderer, final: boolean, mode: SelectionMode): boolean;
    do_inspection(hit_test_result: HitTestResult, geometry: Geometry, graph_view: GraphRendererView, final: boolean, mode: SelectionMode): boolean;
}
