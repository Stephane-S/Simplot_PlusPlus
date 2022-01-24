import pandas as pd
import numpy as np

from bokeh.plotting import figure
from bokeh.models import (BasicTicker, ColorBar, ColumnDataSource,
                          LinearColorMapper, PrintfTickFormatter, Legend, ContinuousTicker)
from bokeh.transform import dodge, factor_cmap
from bokeh.models import Panel, Tabs, Div
from bokeh.models import (
    ColumnDataSource,
    HoverTool,
    LinearColorMapper,
    BasicTicker,
    PrintfTickFormatter,
    ColorBar,
    FactorRange
)
from bokeh.io import show, save,output_file
from bokeh.models import CustomJS, Select
import colorcet as cc
from bokeh.layouts import column, row
from bokeh.resources import CDN
from bokeh.embed import file_html


class quality_report_generator:
    def __init__(self, gap_report_df, gap_threshold_df, distance_report_df, auto_save_path=None):
        gap_report_plot = self.create_gap_plot(gap_report_df)
        threshold_breach_plot, threshold_df = self.create_treshold_plot(gap_threshold_df)
        missing_data_plot, distance_plot, refseq_select_widget = self.create_missing_data_plot(distance_report_df, threshold_df)
        plots = self.plots_formatting(gap_report_plot, threshold_breach_plot,missing_data_plot, distance_plot, refseq_select_widget)

        if auto_save_path is not None:
            self.save_html(plots, auto_save_path)
        show(plots)
        #todo: check if gap threshold is none

    def save_html(self, plots, auto_save_path):
        html = file_html(plots, CDN, "my plot")

        with open(auto_save_path, "w") as f:
            f.write(html)
        print ('done')

    def plots_formatting(self, gap_report_plot, threshold_breach_plot, missing_data_plot, distance_plot, refseq_select_widget):
        tab1 = Panel(child=gap_report_plot, title="Gap frequency")
        tab2 = Panel(child=threshold_breach_plot, title="Gap threshold cutoff")
        plot1 = (Tabs(tabs=[tab1, tab2]))

        black_line0 = Div(text="<hr/>", style={'width': '100%', 'text-align': 'left', 'margin-left': '0'})

        tab3 = Panel(child=missing_data_plot, title="Data completedness")
        tab4 = Panel(child=distance_plot, title="Distance plot")
        plot2 = (column(refseq_select_widget, Tabs(tabs=[tab3, tab4])))

        plots = column(plot1,black_line0, plot2)

        return plots

    def sort_position_list(self, position_list):
        temp_pos_list = []
        ordered_pos_list = []
        for i in range(len(position_list)):
            temp_pos_list.append(int(position_list[i]))

        temp_pos_list = sorted(temp_pos_list)
        for i in range(len(temp_pos_list)):
            ordered_pos_list.append(str(temp_pos_list[i]))

        return ordered_pos_list

    def create_distance_heatmap(self, source, ordered_pos_list, ids_list):
        p = figure(plot_width=900, plot_height=500, title="Sequence similarity heatmap per window over whole sequence",
                   x_range=ordered_pos_list, y_range=ids_list, toolbar_location="below",
                   toolbar_sticky=False)

        mapper = LinearColorMapper(palette=cc.fire, low=0, high=1)

        p.rect("position","ids", 1, 1, source=source,
               color={"field": "similarity", "transform": mapper})

        color_bar = ColorBar(color_mapper=mapper,
                             ticker=BasicTicker(desired_num_ticks=5),
                             label_standoff=6, location=(0, 0))

        hovertool = HoverTool(tooltips=[("position", "@position"), ("ids", "@ids"), ("similarity", "@similarity")])
        p.add_tools(hovertool)
        p.add_layout(color_bar, 'right')
        p.axis.axis_line_color = None
        p.axis.major_tick_line_color = None
        p.axis.major_label_text_font_size = "7px"
        p.axis.major_label_standoff = 0
        p.xaxis.major_label_orientation = 1.0

        # p.add_layout(color_bar, 'right')
        p.xgrid.visible = False
        p.xgrid.grid_line_color = None
        p.ygrid.visible = False
        p.xgrid.grid_line_color = None
        p.ygrid.grid_line_color = None
        p.xaxis.visible = False
        p.yaxis.visible = True
        p.background_fill_color = None
        p.border_fill_color = None

        return p


    def create_missing_data_plot(self, distance_report_df, threshold_df):
        temp_df = threshold_df.loc[threshold_df["status"]== "failed"]
        temp_dict =  temp_df.to_dict("dict")

        threshold_dict = {}
        for key, value in zip(temp_dict["ids"].values(), temp_dict["position"].values()):
            if key not in threshold_dict:
                threshold_dict[key] = [value]
            else:
                threshold_dict[key].append(value)

        cond1 = distance_report_df["similarity"].isnull()
        cond2 = distance_report_df["position"].isin(temp_dict["position"].values())
        cond3 = distance_report_df["ids"].isin(temp_dict["ids"].values())
        cond4 = distance_report_df["refseq"].isin(temp_dict["ids"].values())

        temp_df_2 = distance_report_df[cond1 & cond2 & (cond3 | cond4)]
        distance_report_df.loc[list(temp_df_2.index.values), "status"] = "threshold"

        source = ColumnDataSource(distance_report_df) #todo filter with refseq_select default to avoid plot stacking

        true_source = ColumnDataSource(distance_report_df)
        position_list= list(set(distance_report_df["position"].tolist()))
        ids_list = list(set(distance_report_df["refseq"].tolist()))
        ordered_pos_list = self.sort_position_list(position_list)

        print (ids_list[0])
        filtered_df = distance_report_df.loc[distance_report_df['refseq'] == ids_list[0]]
        first_use_df = filtered_df.loc[filtered_df["ids"] != ids_list[0]]
        #print (first_use_df.to_string())
        source = ColumnDataSource(first_use_df)
        first_use_ids_list = []
        for id in ids_list:
            if id != ids_list[0]:
                first_use_ids_list.append(id)
        print (first_use_ids_list)

        distance_plot = self.create_distance_heatmap(source, ordered_pos_list, first_use_ids_list)

        #https://learnui.design/tools/data-color-picker.html
        cmap = {
        "distance calculated": "#003F5C",
        "Not calculated": "#D45087",
        "threshold": "#FFA600"
        }

        p = figure(plot_width=900, plot_height=500, title="Distance calculability per window over whole sequence",
                   x_range=ordered_pos_list, y_range=first_use_ids_list) #ids_list

        p.add_layout(Legend(), "right")
        p.rect("position", "ids", 1, 1, source=source,
               color=factor_cmap('status', palette=list(cmap.values()), factors=list(cmap.keys())), legend_field="status")

        javascript_code = self.code_for_callback()
        main_callback = CustomJS(args=dict(source=source, true_source=true_source, plot=p, distance_plot=distance_plot, ids_list=ids_list), code=javascript_code)
        refseq_select = Select(title="Refseq:", value=ids_list[0], options=ids_list, name="refseq_select")
        refseq_select.js_on_change("value", main_callback)


        hovertool = HoverTool(tooltips=[("position", "@position"), ("ids", "@ids")])
        p.add_tools(hovertool)

        p.axis.axis_line_color = None
        p.axis.major_tick_line_color = None
        p.axis.major_label_text_font_size = "7px"
        p.axis.major_label_standoff = 0
        p.xaxis.major_label_orientation = 1.0

        # p.add_layout(color_bar, 'right')
        p.xgrid.visible = False
        p.xgrid.grid_line_color = None
        p.ygrid.visible = False
        p.xgrid.grid_line_color = None
        p.ygrid.grid_line_color = None
        p.xaxis.visible = False
        p.yaxis.visible = True
        p.background_fill_color = None
        p.border_fill_color = None

        # tab1 = Panel(child=p, title="Data completedness")
        # tab2 = Panel(child=distance_plot, title="distance plot")
        #show(column(refseq_select, Tabs(tabs=[tab1, tab2])))
        return p, distance_plot, refseq_select

    def create_treshold_plot(self, gap_threshold_df):
        # formating column and row names
        gap_threshold_df = gap_threshold_df.T
        gap_threshold_df.reset_index(inplace=True)
        gap_threshold_df = gap_threshold_df.rename(columns={"index": "position"})
        gap_threshold_df.position = gap_threshold_df.position.astype("str")
        gap_threshold_df = gap_threshold_df.set_index("position")
        gap_threshold_df.columns.name = "ids"

        # reshape to 1D array --> gap_rate with a position and id for each row.
        df = pd.DataFrame(gap_threshold_df.stack(), columns=['threshold']).reset_index()
        df['status'] = np.where(
            df['threshold'] == 0, "failed", np.where(
                df['threshold'] == 1, "passed", "failed"))

        source = ColumnDataSource(df)
        mapper = LinearColorMapper(palette=("#ffa600", "#003f5c"), low=0, high=1)

        p = figure(plot_width=800, plot_height=300, title="Gap threshold cutoff per window over whole sequence",
                   x_range=list(gap_threshold_df.index), y_range=list(reversed(gap_threshold_df.columns)), #list(gap_threshold_df.index)
                   toolbar_location="below", toolbar_sticky=False, x_axis_location="above")

        p.add_layout(Legend(), "right")
        p.rect(x="position", y="ids", width=1, height=1, source=source,
               color={"field": "threshold", "transform": mapper},legend_field="status") # legend="threshold"


        #show(p)

        hovertool = HoverTool(tooltips=[("position", "@position"), ("ids", "@ids")])
        p.add_tools(hovertool)
        p.axis.axis_line_color = None
        p.axis.major_tick_line_color = None
        p.axis.major_label_text_font_size = "7px"
        p.axis.major_label_standoff = 0
        p.xaxis.major_label_orientation = 1.0

        #p.add_layout(color_bar, 'right')
        p.xgrid.visible = False
        p.xgrid.grid_line_color = None
        p.ygrid.visible = False
        p.xgrid.grid_line_color = None
        p.ygrid.grid_line_color = None
        p.xaxis.visible = False
        p.yaxis.visible = True
        p.background_fill_color = None
        p.border_fill_color = None

        return p, df


    def create_gap_plot(self, gap_report_df):
        # formating column and row names
        gap_report_df = gap_report_df.T
        gap_report_df.reset_index(inplace=True)
        gap_report_df = gap_report_df.rename(columns={"index": "position"})
        gap_report_df.position = gap_report_df.position.astype("str")
        gap_report_df = gap_report_df.set_index("position")
        gap_report_df.columns.name = "ids"

        # reshape to 1D array --> gap_rate with a position and id for each row.
        df = pd.DataFrame(gap_report_df.stack(), columns=['gap_rate']).reset_index()

        #plugging df in bokeh source data
        source = ColumnDataSource(df)

        #bokeh plot creation
        mapper = LinearColorMapper(palette=cc.fire, low=0, high=100)

        p = figure(plot_width=800, plot_height=300, title="Gap frequency per window over whole sequence",
                   x_range=list(gap_report_df.index), y_range=list(reversed(gap_report_df.columns)),
                   toolbar_location="below", toolbar_sticky=False, x_axis_location="above")

        p.rect(x="position", y="ids", width=1, height=1, source=source,
               color={"field": "gap_rate", "transform": mapper})

        color_bar = ColorBar(color_mapper=mapper,
                             ticker=BasicTicker(desired_num_ticks=5),
                             formatter=PrintfTickFormatter(format="%d%%"), label_standoff=6, location=(0,0))

        # #color bar title
        # plot_height = 300
        # plot_width = 500
        # color_bar_height = plot_height + 11
        # color_bar_width = 180
        # color_bar_plot = figure(title="My color bar title", title_location="right",
        #                         height=color_bar_height, width=color_bar_width,
        #                         toolbar_location=None, min_border=0,
        #                         outline_line_color=None)
        #
        # color_bar_plot.add_layout(color_bar, 'right')
        # color_bar_plot.title.align = "center"
        # color_bar_plot.title.text_font_size = '12pt'
        ###

        hovertool = HoverTool(tooltips=[("position", "@position"), ("ids", "@ids"), ("gap frequency (%)", "@gap_rate")])
        p.add_tools(hovertool)
        p.axis.axis_line_color = None
        p.axis.major_tick_line_color = None
        p.axis.major_label_text_font_size = "7px"
        p.axis.major_label_standoff = 0
        p.xaxis.major_label_orientation = 1.0

        p.add_layout(color_bar, 'right')
        p.xgrid.visible = False
        p.xgrid.grid_line_color=None
        p.ygrid.visible = False
        p.xgrid.grid_line_color= None
        p.ygrid.grid_line_color = None
        p.xaxis.visible = False
        p.yaxis.visible = True
        p.background_fill_color = None
        p.border_fill_color = None

        #p = row(p, color_bar_plot)
        # # html = embed.file_html(p, resources.CDN, "my plot")
        # output_file("output_file_name.html")
        # save(p)
        # show(p)
        return p

    def code_for_callback(self):
        code = """
        // connect to widgets and data
        var unfiltered_data = true_source.data;
        var refseq_select =  Bokeh.documents[0].get_model_by_name('refseq_select');
        
        // extract widget values
        var refseq = refseq_select.value;
        
        console.error(unfiltered_data);
        var unfiltered_ids = unfiltered_data['ids'];
        var unfiltered_index = unfiltered_data['index'];
        var unfiltered_position = unfiltered_data['position'];
        var unfiltered_refseq = unfiltered_data['refseq'];
        var unfiltered_similarity = unfiltered_data['similarity'];
        var unfiltered_status = unfiltered_data['status'];
        
        var filtered_ids = [];
        var filtered_index = [];
        var filtered_position = [];
        var filtered_refseq = [];
        var filtered_similarity = [];
        var filtered_status = [];
        
        var count = 0;
        var filtered_data = {}; // new data source
         for (var i = 0; i < unfiltered_index.length; i++){ // go through the dict of data
            if (unfiltered_refseq[i] == refseq){ // filter for the refseq
                if (unfiltered_ids[i] != refseq){ // remove the refseq id from the data
                    filtered_ids.push(unfiltered_ids[i]);
                    filtered_index.push(unfiltered_index[i]);
                    filtered_position.push(unfiltered_position[i]);
                    filtered_refseq.push(unfiltered_refseq[i]);
                    filtered_similarity.push(unfiltered_similarity[i]);
                    filtered_status.push(unfiltered_status[i]);
                    
                    count = count+ 1;
                }
            }
         }
         console.error(count);
         filtered_data['ids'] = filtered_ids;
         filtered_data['index'] = filtered_index;
         filtered_data['position'] = filtered_position;
         filtered_data['refseq'] = filtered_refseq;
         filtered_data['similarity'] = filtered_similarity;
         filtered_data['status'] = filtered_status;
         
         var new_y_range = ids_list.slice();
         for( var i = 0; i < new_y_range.length; i++){ 
                                   
            if ( new_y_range[i] === refseq) { 
                new_y_range.splice(i, 1); 
                i--; 
            }
        }
         
         console.error(new_y_range);
         
         console.error(plot.y_range);
         plot.y_range.factors = new_y_range;
         distance_plot.y_range.factors = new_y_range;
         plot.change.emit();
         distance_plot.change.emit();
         console.error(plot.y_range);
         source.data = filtered_data;
         source.change.emit(); 
         
        """

        return code