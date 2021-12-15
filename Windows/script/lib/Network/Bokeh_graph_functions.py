from bokeh import plotting, embed, resources
from bokeh.io import output_file, save
from bokeh.models import (BoxZoomTool, Circle, HoverTool, SaveTool,
                          MultiLine, Plot, Range1d, ResetTool, PanTool, StaticLayoutProvider, GraphRenderer, TapTool)
from bokeh.models import CustomJS, RangeSlider, Slider, LabelSet, ColumnDataSource, CustomJSTransform, \
    CheckboxButtonGroup, Select, TextInput, Spinner, MultiChoice, GraphRenderer, Ellipse, LinearColorMapper, ColorBar, \
    Ticker, DataTable, TableColumn, Paragraph, Div, CheckboxGroup
from bokeh.palettes import Spectral4, Reds256, gray, Viridis256, brewer, Reds
from bokeh.plotting import from_networkx, figure
from bokeh.layouts import column, row
from bokeh.transform import transform, linear_cmap
import networkx as nx
import copy
import pathlib

def create_settings_label_text(model_settings_dict):
    gap_penalty_models = ["Hamming", "Jukes-Cantor"]
    param_a_models = ["JinNeiGamma"]

    text = "<b><u>Model Parameters</u></b>" + '</br>'\
            f"<b>model</b>: {model_settings_dict['model']} " + \
            f" <b>window length</b>: {model_settings_dict['window']}, " +\
            f" <b>step</b>: {model_settings_dict['step']}"

    if model_settings_dict['model'] in param_a_models:
        if model_settings_dict['param_a'] is None:
            text = text + f" <b>parameter α</b>: Auto"
        else:
            text = text + f" <b>parameter α</b>: {model_settings_dict['param_a']}"

    if model_settings_dict['model'] in gap_penalty_models:
        text = text + f" <b>gap value</b>: {model_settings_dict['gap']}"

    if  model_settings_dict["gap_treshold"] is not None:
        text = text + f" <b>gap threshold</b>: {model_settings_dict['gap_treshold']}"
    else:
        text = text + f" <b>gap threshold</b>: N/A"

    return text




def get_color_palette_dicts():
    # create a 100 color red palette dict
    reds256 = Reds256[::-1]
    reds101 = []
    for i in range(101):
        reds101.append(reds256[2 * i])

    reds101_dict = dict(zip(list(range(101)), reds101))

    # create a 100 color gray palette dict
    gray101 = list(gray(101)[::-1])
    gray101_dict = dict(zip(list(range(101)), gray101))

    return reds101_dict, reds101, gray101_dict, gray101


def edge_color_map(plot):
    reds101_dict, reds101, gray101_dict, gray101 = get_color_palette_dicts()

    local_color_mapper = LinearColorMapper(palette=reds101, low=0, high=100)
    local_color_bar = ColorBar(color_mapper=local_color_mapper,
                               label_standoff=12, border_line_color=None, location=(0, 0), title="local (%)",
                               title_text_font_style="bold", title_standoff=10)

    global_color_mapper = LinearColorMapper(palette=gray101, low=0, high=100)
    global_color_bar = ColorBar(color_mapper=global_color_mapper,
                                label_standoff=12, border_line_color=None, location=(0, 0), title="global (%)",
                                title_text_font_style="bold", title_standoff=10)

    plot.add_layout(local_color_bar, 'right')
    plot.add_layout(global_color_bar, 'right')

    return plot


# Draw quadratic bezier paths
def bezier(start, end, control, steps):
    return [(1 - s) ** 2 * start + 2 * (1 - s) * s * control + s ** 2 * end for s in steps]


def add_curved_local_edges(plot, graph_renderer_local):
    coord_dict = graph_renderer_local.layout_provider.graph_layout
    graph_layout = {}
    for index, coord_list in coord_dict.items():
        graph_layout[index] = (coord_list[0], coord_list[1])

    graph_renderer_local.layout_provider = StaticLayoutProvider(graph_layout=graph_layout)

    xs, ys = [], []

    for i in range(len(graph_renderer_local.edge_renderer.data_source.data['start'])):

        start_node = graph_renderer_local.edge_renderer.data_source.data['start'][i]
        end_node = graph_renderer_local.edge_renderer.data_source.data['end'][i]
        sx, sy = graph_layout[start_node]
        ex, ey = graph_layout[end_node]
        if graph_renderer_local.edge_renderer.data_source.data['sim_type'][i] == "local":
            steps = [i / 100. for i in range(100)]
            xs.append(bezier(sx, ex, 0, steps))
            ys.append(bezier(sy, ey, 0, steps))
        else:  # if global similarity
            xs.append([sx, ex])
            ys.append([sy, ey])

    graph_renderer_local.edge_renderer.data_source.data['xs'] = xs
    graph_renderer_local.edge_renderer.data_source.data['ys'] = ys

    return plot, graph_renderer_local


def add_labels(plot, graph_renderer_global):
    # add the labels to the node renderer data source
    source = graph_renderer_global.node_renderer.data_source
    source.data['names'] = [str(x) for x in source.data['index']]  # index names

    # create a transform that can extract the actual x,y positions
    code = """
        var result = new Float64Array(xs.length)
        for (var i = 0; i < xs.length; i++) {
            result[i] = provider.graph_layout[xs[i]][%s]
        }
        return result
    """
    xcoord = CustomJSTransform(v_func=code % "0", args=dict(provider=graph_renderer_global.layout_provider))
    ycoord = CustomJSTransform(v_func=code % "1", args=dict(provider=graph_renderer_global.layout_provider))

    # Use the transforms to supply coords to a LabelSet
    labels = LabelSet(x=transform('index', xcoord),
                      y=transform('index', ycoord),
                      text='names', text_font_size="12px",
                      x_offset=5, y_offset=5,
                      source=source, render_mode='canvas')

    plot.add_layout(labels)

    return plot


def create_renderer(graph_global_edge, graph_local_edge, plot):
    graph_global = from_networkx(graph_global_edge, nx.circular_layout, scale=1, center=(0, 0))  # nx.spring_layout
    graph_global.node_renderer.glyph = Circle(size=15, fill_color='color')  # Spectral4[0]
    graph_global.edge_renderer.glyph = MultiLine(line_color="color", line_alpha="line_alpha", line_width="weight",
                                                 line_dash='solid')

    graph_local = from_networkx(graph_local_edge, nx.circular_layout, scale=1, center=(0, 0))  # nx.spring_layout
    graph_local.node_renderer.glyph = Circle(size=15, fill_color='color')  # Spectral4[0]
    graph_local.edge_renderer.glyph = MultiLine(line_color="color", line_alpha="line_alpha", line_width="weight",
                                                line_dash='dotted') #dotted

    return plot, graph_global, graph_local


def add_widgets(plot, graph_global_edge, graph_renderer_global, graph_renderer_local, seq_length, step,
                model_settings_dict, recombination_df):
    code_multichoice = code_for_callback()
    backup_node_data = copy.deepcopy(graph_renderer_global.node_renderer.data_source.data)

    range_slider = RangeSlider(start=0, end=seq_length, value=(0, seq_length), step=step, title="Local Sequence Range",
                               name="range_s")

    OPTIONS = list(graph_global_edge.nodes)
    multichoice = MultiChoice(value=OPTIONS, options=OPTIONS, name="multi1")

    local_sim_checkbox = CheckboxGroup(labels=["View local similarity edges"], active=[0], name="local_sim_checkbox")
    global_sim_checkbox = CheckboxGroup(labels=["View global similarity edges"], active=[0], name="global_sim_checkbox")

    Cbg_labels = ["Global Similarity", "Local Similarity"]
    Cbg_sim = CheckboxButtonGroup(labels=Cbg_labels, active=[0, 1], name="sim_Btn")

    global_threshold_slider = Slider(start=0, end=100, value=75, step=1, title="Global Similarity Threshold (%)",
                                     name="threshold_slider")
    local_threshold_slider = Slider(start=0, end=100, value=90, step=1, title="Local Similarity Threshold (%)",
                                    name="local_threshold_slider")


    global_columns = [
        TableColumn(field="start", title="Group 1", width=100),
        TableColumn(field="end", title="Group 2", width=100),
        TableColumn(field="sim_type", title="Similarity type", width=50),
        TableColumn(field="similarity", title="Similarity (%)", width=10000)
    ]
    global_info_table = DataTable(source=graph_renderer_global.edge_renderer.data_source, columns=global_columns, width=600,
                               height=250, fit_columns=False, selectable=True)



    local_columns = [
        TableColumn(field="start", title="Group 1", width=100),
        TableColumn(field="end", title="Group 2", width=100),
        TableColumn(field="sim_type", title="Similarity type", width=50),
        TableColumn(field="pos_range", title="Similarity ranges", width=10000)
    ]
    local_info_datatable = DataTable(source=graph_renderer_local.edge_renderer.data_source, columns=local_columns, width=600,
                               height=250, fit_columns=False, selectable=True)  # , selectable=True, fit_columns=False

    columns_recombination_df = [TableColumn(field=Ci, title=Ci) for Ci in recombination_df.columns]  # bokeh columns
    recombination_data_table = DataTable(columns=columns_recombination_df, source=ColumnDataSource(recombination_df.head(10)), height=250)  # bokeh table

    global_datatable_label = Div(text="<b><u>Global similarities intervals</u></b>")
    local_datatable_label = Div(text="<b><u>Local similarities intervals</u></b>")
    global_settings_label = Div(text="<b><u>Global Similarity settings</u></b>")
    local_settings_label = Div(text="<b><u>Local Similarity settings</u></b>")
    recombination_label = Div(text="<b><u>Top 10 recombination candidates (Proportion test)</u></b>")
    settings_text = create_settings_label_text(model_settings_dict)
    settings_label = Div(text=settings_text)

    black_line0 = Div(text="<hr/>", style={'width': '100%', 'text-align': 'left', 'margin-left': '0'})
    black_line1 = Div(text="<hr/>", style={'width': '100%', 'text-align': 'left', 'margin-left': '0'})
    black_line2 = Div(text="<hr/>", style={'width': '100%', 'text-align': 'left', 'margin-left': '0'})
    reds101_dict, reds101, gray101_dict, gray101 = get_color_palette_dicts()

    main_callback = CustomJS(args=dict(graph_setup_local=graph_renderer_local,
                                       graph_setup_global=graph_renderer_global,
                                       local_edge=graph_renderer_local.edge_renderer.data_source.data,
                                       local_node=graph_renderer_local.node_renderer.data_source.data,
                                       global_edge=graph_renderer_global.edge_renderer.data_source.data,
                                       global_node=graph_renderer_global.node_renderer.data_source.data,
                                       ndata=backup_node_data,
                                       sliders=range_slider,
                                       multi=multichoice,
                                       reds101_dict=reds101_dict,
                                       gray101_dict=gray101_dict,
                                       step=step,
                                       window_length = model_settings_dict['window'],
                                       tap_selected=graph_renderer_global.node_renderer.data_source.selected),
                             code=code_multichoice)

    multichoice.js_on_change('value', main_callback)
    range_slider.js_on_change('value', main_callback)

    Cbg_sim.js_on_click(main_callback)
    global_threshold_slider.js_on_change('value', main_callback)
    local_threshold_slider.js_on_change('value', main_callback)
    local_sim_checkbox.js_on_click(main_callback)
    global_sim_checkbox.js_on_click(main_callback)
    plot.js_on_event('tap', main_callback)

    plot_with_widget = column(row(column(plot, multichoice, settings_label),
                              column(global_settings_label, global_sim_checkbox, global_threshold_slider, global_datatable_label, global_info_table, black_line1,
                                     local_settings_label, local_sim_checkbox, local_threshold_slider, range_slider, black_line2,
                                     local_datatable_label, local_info_datatable, black_line0, recombination_label, recombination_data_table)))

    return plot_with_widget


def plot_bokeh(graph_global_edge, graph_local_edge, seq_length, step, model_settings_dict, recombination_df):
    # create plot
    plot = Plot(plot_width=1000, plot_height=1000,
                x_range=Range1d(-1.1, 1.1), y_range=Range1d(-1.1, 1.1),
                toolbar_location="above")
    plot.title.text = "Sequence similarity network"
    plot.title.text_font_size = "12pt"

    # add tools
    node_hover_tool = HoverTool(tooltips=[("index", "@index")])
    plot.add_tools(node_hover_tool, BoxZoomTool(), ResetTool(), PanTool(), TapTool(), SaveTool())

    # create renderers
    plot, graph_renderer_global, graph_renderer_local = create_renderer(graph_global_edge, graph_local_edge, plot)

    plot, graph_renderer_local = add_curved_local_edges(plot, graph_renderer_local)
    plot, graph_renderer_global = add_curved_local_edges(plot, graph_renderer_global)

    plot = edge_color_map(plot)

    plot.renderers.append(graph_renderer_global)
    plot.renderers.append(graph_renderer_local)

    plot = add_labels(plot,
                      graph_renderer_global)  # only global as to not double the name labels. same positions anyway
    plot = add_widgets(plot, graph_global_edge, graph_renderer_global, graph_renderer_local, seq_length, step,
                       model_settings_dict, recombination_df)

    # plot, graph_renderer = add_curved_local_edges(G, plot, graph_renderer)
    # plot.renderers.append(graph_renderer)
    # print (graph_global_edge.nodes)
    # print(list(graph_global_edge.edges))
    # print (graph_local_edge.nodes)
    # print(list(graph_local_edge.edges))

    # html = Document()
    # html.add_root(plot)
    output_path = pathlib.Path("stored/network_output.html")
    output_file(output_path)

    save(plot)
    # show(plot)

    html = embed.file_html(plot, resources.CDN, "my plot")
    return html


def code_for_callback():
    code_multichoice = """
    
    // access widgets
        console.error('entering callback');
        var widget_multichoice = Bokeh.documents[0].get_model_by_name('multi1');
        var widget_range_slider = Bokeh.documents[0].get_model_by_name('range_s');
        //var widget_cbg_sim = Bokeh.documents[0].get_model_by_name('sim_Btn');
        var widget_threshold_slider = Bokeh.documents[0].get_model_by_name('threshold_slider');
        var widget_local_threshold_slider = Bokeh.documents[0].get_model_by_name('local_threshold_slider');
        var widget_local_sim_checkbox = Bokeh.documents[0].get_model_by_name('local_sim_checkbox')
        var widget_global_sim_checkbox = Bokeh.documents[0].get_model_by_name('global_sim_checkbox')
        var index_tap = [];
        for (var i = 0; i < tap_selected.indices.length; i++){
            index_tap.push(parseInt(tap_selected.indices[i], 10));
        }
        var group_tap = [];
        for (var i = 0; i < index_tap.length; i++){
            group_tap.push(ndata['group_name'][index_tap[i]]);
        }  
        
    // extract widget data
        var choice_value = widget_multichoice.value;
        var min_range = widget_range_slider.value[0];
        var max_range = widget_range_slider.value[1];
        var global_threshold = widget_threshold_slider.value;
        var local_threshold = widget_local_threshold_slider.value;
        
        //--------------------------- general functions ----------------------------
        
        
        function check_chosen_sim_types(){
            var sim_type_list = [];

            if ((widget_local_sim_checkbox.active).length > 0){
                sim_type_list.push('local');
            }
            if ((widget_global_sim_checkbox.active).length > 0){
                sim_type_list.push('global');
            }
            return sim_type_list;
        }
        
        function is_in_multichoice(start_node, end_node){
            var multichoice_bool = choice_value.includes(start_node) && choice_value.includes(end_node)
            return multichoice_bool;
        }
        
        function is_over_threshold(type, sim_range){
            var bool = false
            if (type == 'local'){
                bool = sim_range >= local_threshold;
            } 
            else if (type == 'global'){
                bool = sim_range >= global_threshold;
            }
            return bool
        }
        
        function is_in_seq_range(pos_range){
            return (pos_range >= min_range && pos_range <= max_range);
        }
        
        function get_similarity_range_string(temp_range, temp_local_sim){
            var first = 0;
            var next = 0;
            var range_sim_max = 0;
            var result = '';

            for (var k = 0; k < temp_range.length; k++){
                var p = k+1;
                first = temp_range[k];
                next = temp_range[p];
                while (next - first == step && p < temp_range.length){
                    p = p +1;
                    first = next;
                    next = temp_range[p];
                }
                range_sim_max = Math.max.apply(Math, temp_local_sim.slice(k, p));
                if (temp_range[k] == temp_range[p-1]){
                    //result = result + '[' + temp_range[k].toString() + ']: ' + range_sim_max +'%; '
                    result = result + '[' + (temp_range[k] - window_length/2).toString() + '-' + (temp_range[k] + window_length/2).toString() + ']: ' + range_sim_max +'%; '
                    //console.error(temp_range[k].toString() + " becomes " + (temp_range[k] - window_length/2).toString() + '-' + (temp_range[k] + window_length/2).toString());
                } else{
                    //result = result + '[' + temp_range[k].toString() + '-' + temp_range[p-1].toString() + ']: ' + range_sim_max +'%; '
                    result = result + '[' + (temp_range[k] - window_length/2).toString() + '-' + (temp_range[p-1] + window_length/2).toString() + ']: ' + range_sim_max +'%; '
                    //console.error('[' + temp_range[k].toString() + '-' + temp_range[p-1].toString() + 'becomes' + '[' + (temp_range[k] - window_length/2).toString() + '-' + (temp_range[p-1] + window_length/2).toString() + ']: ')
                }
                k = p
            }
            return result;
        }
        
        function set_new_alpha(group_tap, new_start, new_end){
            var new_alpha = 0.8;
            if (group_tap.length > 0){
                if ((group_tap.includes(new_start)) || (group_tap.includes(new_end))){
                    new_alpha = 0.8
                 } else {
                    new_alpha = 0.1
                }
            }
            return new_alpha    
        }
        
        //---------------------------local edge function----------------------------------------
        
  
        
        function main_local_graph(new_start, new_end, sim_type_list, pos_range, similarity){
            var temp_start = [];
            var temp_end = [];
            var temp_color = [];
            var temp_sim_type = [];
            var temp_similarity = [];
            var temp_pos_range = [];
            var temp_xs = [];
            var temp_ys = [];
            var temp_c_map = [];
            var new_color = '#0000FF';
            var max_sim_value = 0;
            var temp_line_alpha = [];
            var new_alpha = 0.8;
            var new_weight = [];
            
            for (var i = 0; i < new_start.length; i++){
                var temp_range = [];
                var temp_local_sim = [];
                var result = '';
                
                if (sim_type_list.includes('local')){
                    if (is_in_multichoice(new_start[i], new_end[i])){
                        for (var j = 0; j < pos_range[i].length; j++){
                            if (is_in_seq_range(pos_range[i][j]) && is_over_threshold('local', similarity[i][j])){
                                temp_range.push(pos_range[i][j]);
                                temp_local_sim.push(similarity[i][j])
                            }
                        }
                        
                        if (temp_local_sim.length > 0 && temp_local_sim.length == temp_range.length){
                            max_sim_value = Math.max.apply(Math, [...temp_local_sim]);
                            new_color = reds101_dict[max_sim_value];
                            result = get_similarity_range_string(temp_range, temp_local_sim);
                            new_alpha = set_new_alpha(group_tap, new_start[i], new_end[i]);
                        
                            temp_start.push(new_start[i]);
                            temp_end.push(new_end[i]);
                            temp_color.push(new_color);
                            temp_sim_type.push(local_edge['sim_type'][i]);
                            temp_similarity.push(temp_local_sim);
                            temp_pos_range.push(result)
                            temp_xs.push(local_edge['xs'][i]);
                            temp_ys.push(local_edge['ys'][i]);
                            temp_c_map.push(local_edge['c_map'][i]); // modify
                            temp_line_alpha.push(new_alpha);
                            new_weight.push(((local_edge['c_map'][i])/100)*4);
                        }
                    }
                }
            
            }
            
            
            
            graph_setup_local.edge_renderer.data_source.data = {
            'start': temp_start, 
            'end': temp_end, 
            'color' : temp_color, 
            'sim_type' : temp_sim_type, 
            'similarity' : temp_similarity, 
            'pos_range' : temp_pos_range, 
            'xs' : temp_xs, 
            'ys' : temp_ys, 
            'c_map' : temp_c_map, 
            'line_alpha': temp_line_alpha,
            'weight' : new_weight
            };
        }
        
        //--------------------------global edge function------------------------------
        
        function main_global_graph(new_start, new_end, sim_type_list){
            var temp_start = [];
            var temp_end = [];
            var temp_color = [];
            var temp_sim_type = [];
            var temp_similarity = [];
            var temp_pos_range = [];
            var temp_xs = [];
            var temp_ys = [];
            var temp_c_map = [];
            var new_color = '#0000FF';
            var max_value = 0;
            var temp_line_alpha = [];
            var new_alpha = 0.8;
            var new_weight = [];
            
            for (var i = 0; i < new_start.length; i++){
            
                if (sim_type_list.includes('global')){
                    if (is_in_multichoice(new_start[i], new_end[i])){
                        if (is_over_threshold('global', global_edge['similarity'][i])){
                            new_alpha = set_new_alpha(group_tap, new_start[i], new_end[i]);
                                                      
                            temp_start.push(new_start[i]);
                            temp_end.push(new_end[i]);
                            temp_color.push(global_edge['color'][i]);
                            temp_sim_type.push(global_edge['sim_type'][i]);
                            temp_similarity.push(global_edge['similarity'][i]);
                            temp_pos_range.push('result')
                            temp_xs.push(global_edge['xs'][i]);
                            temp_ys.push(global_edge['ys'][i]);
                            temp_c_map.push(global_edge['c_map'][i]);
                            temp_line_alpha.push(new_alpha);
                            new_weight.push(((global_edge['c_map'][i])/100)*4)
                        } 
                    }
                }
            
            }
            
            graph_setup_global.edge_renderer.data_source.data = {
            'start': temp_start, 
            'end': temp_end, 
            'color' : temp_color, 
            'sim_type' : temp_sim_type, 
            'similarity' : temp_similarity, 
            'pos_range' : temp_pos_range, 
            'xs' : temp_xs, 
            'ys' : temp_ys, 
            'c_map' : temp_c_map, 
            'line_alpha': temp_line_alpha,
            'weight': new_weight
            };
        }
        
        //-------------------------local and global nodes function------------------------------------
        function main_node(){
                       
            var new_data_node = {};
            var temp_node_index = [];
            var temp_node_group_size = [];
            var temp_node_group_name = [];
            var temp_node_group_content = [];
            var temp_node_color = [];
            var node_names = [];
            
            for (var i = 0; i < ndata['index'].length; i++){          // filter node if in multichoice
                if (choice_value.includes(ndata['index'][i])){
                    temp_node_index.push(ndata['index'][i]);
                    temp_node_group_size.push(ndata['group_size'][i]);
                    temp_node_group_name.push(ndata['group_name'][i]);
                    temp_node_group_content.push(ndata['group_content'][i]);
                    temp_node_color.push(ndata['color'][i])
                }
            }
            node_names = [...temp_node_index];           
        
            graph_setup_local.node_renderer.data_source.data = {
            'group_size' : temp_node_group_size, 
            'group_content' : temp_node_group_content, 
            'group_name' : temp_node_group_name, 
            'index' : temp_node_index, 
            'names' : node_names, 
            'color' : temp_node_color
            };
            
            graph_setup_global.node_renderer.data_source.data = {
            'group_size' : temp_node_group_size, 
            'group_content' : temp_node_group_content, 
            'group_name' : temp_node_group_name, 
            'index' : temp_node_index, 
            'names' : node_names, 
            'color' : temp_node_color
            };
        }
    
    var sim_type_list = check_chosen_sim_types();
    
    main_local_graph([...local_edge["start"]], [...local_edge["end"]], sim_type_list, local_edge["pos_range"], local_edge['similarity']);
    main_global_graph([...global_edge["start"]], [...global_edge["end"]], sim_type_list);
    main_node();
    """
    return code_multichoice
