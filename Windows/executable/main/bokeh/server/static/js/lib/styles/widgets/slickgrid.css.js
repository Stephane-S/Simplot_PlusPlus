const css = `
.bk-root {
  /*
IMPORTANT:
In order to preserve the uniform grid appearance, all cell styles need to have padding, margin and border sizes.
No built-in (selected, editable, highlight, flashing, invalid, loading, :focus) or user-specified CSS
classes should alter those!
*/
  /*
IMPORTANT:
In order to preserve the uniform grid appearance, all cell styles need to have padding, margin and border sizes.
No built-in (selected, editable, highlight, flashing, invalid, loading, :focus) or user-specified CSS
classes should alter those!
*/
  /* Menu button */
  /* Menu */
  /* Menu items */
  /* Disabled */
  /* Divider */
  /* Excluded item from Column Picker will be hidden */
}
.bk-root .slick-header.ui-state-default,
.bk-root .slick-headerrow.ui-state-default,
.bk-root .slick-footerrow.ui-state-default,
.bk-root .slick-top-panel-scroller.ui-state-default,
.bk-root .slick-group-header.ui-state-default {
  width: 100%;
  overflow: auto;
  position: relative;
  border-left: 0px !important;
}
.bk-root .slick-header.ui-state-default {
  overflow: inherit;
}
.bk-root .slick-header::-webkit-scrollbar,
.bk-root .slick-headerrow::-webkit-scrollbar,
.bk-root .slick-footerrow::-webkit-scrollbar {
  display: none;
}
.bk-root .slick-header-columns,
.bk-root .slick-headerrow-columns,
.bk-root .slick-footerrow-columns,
.bk-root .slick-group-header-columns {
  position: relative;
  white-space: nowrap;
  cursor: default;
  overflow: hidden;
}
.bk-root .slick-header-column.ui-state-default,
.bk-root .slick-group-header-column.ui-state-default {
  position: relative;
  display: inline-block;
  box-sizing: content-box !important;
  /* this here only for Firefox! */
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  height: 16px;
  line-height: 16px;
  margin: 0;
  padding: 4px;
  border-right: 1px solid silver;
  border-left: 0px !important;
  border-top: 0px !important;
  border-bottom: 0px !important;
  float: left;
}
.bk-root .slick-footerrow-column.ui-state-default {
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  margin: 0;
  padding: 4px;
  border-right: 1px solid silver;
  border-left: 0px;
  border-top: 0px;
  border-bottom: 0px;
  float: left;
  line-height: 20px;
  vertical-align: middle;
}
.bk-root .slick-headerrow-column.ui-state-default,
.bk-root .slick-footerrow-column.ui-state-default {
  padding: 4px;
}
.bk-root .slick-header-column-sorted {
  font-style: italic;
}
.bk-root .slick-sort-indicator {
  display: inline-block;
  width: 8px;
  height: 5px;
  margin-left: 4px;
  margin-top: 6px;
  float: left;
}
.bk-root .slick-sort-indicator-numbered {
  display: inline-block;
  width: 8px;
  height: 5px;
  margin-left: 4px;
  margin-top: 0;
  line-height: 20px;
  float: left;
  font-family: Arial;
  font-style: normal;
  font-weight: bold;
  color: #6190CD;
}
.bk-root .slick-sort-indicator-desc {
  background: url(images/sort-desc.gif);
}
.bk-root .slick-sort-indicator-asc {
  background: url(images/sort-asc.gif);
}
.bk-root .slick-resizable-handle {
  position: absolute;
  font-size: 0.1px;
  display: block;
  cursor: col-resize;
  width: 9px;
  right: -5px;
  top: 0;
  height: 100%;
  z-index: 1;
}
.bk-root .slick-sortable-placeholder {
  background: silver;
}
.bk-root .grid-canvas {
  position: relative;
  outline: 0;
}
.bk-root .slick-row.ui-widget-content,
.bk-root .slick-row.ui-state-active {
  position: absolute;
  border: 0px;
  width: 100%;
}
.bk-root .slick-cell,
.bk-root .slick-headerrow-column,
.bk-root .slick-footerrow-column {
  position: absolute;
  border: 1px solid transparent;
  border-right: 1px dotted silver;
  border-bottom-color: silver;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  vertical-align: middle;
  z-index: 1;
  padding: 1px 2px 2px 1px;
  margin: 0;
  white-space: nowrap;
  cursor: default;
}
.bk-root .slick-cell,
.bk-root .slick-headerrow-column {
  border-bottom-color: silver;
}
.bk-root .slick-footerrow-column {
  border-top-color: silver;
}
.bk-root .slick-group-toggle {
  display: inline-block;
}
.bk-root .slick-cell.highlighted {
  background: lightskyblue;
  background: rgba(0, 0, 255, 0.2);
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}
.bk-root .slick-cell.flashing {
  border: 1px solid red !important;
}
.bk-root .slick-cell.editable {
  z-index: 11;
  overflow: visible;
  background: white;
  border-color: black;
  border-style: solid;
}
.bk-root .slick-cell:focus {
  outline: none;
}
.bk-root .slick-reorder-proxy {
  display: inline-block;
  background: blue;
  opacity: 0.15;
  cursor: move;
}
.bk-root .slick-reorder-guide {
  display: inline-block;
  height: 2px;
  background: blue;
  opacity: 0.7;
}
.bk-root .slick-selection {
  z-index: 10;
  position: absolute;
  border: 2px dashed black;
}
.bk-root .slick-pane {
  position: absolute;
  outline: 0;
  overflow: hidden;
  width: 100%;
}
.bk-root .slick-pane-header {
  display: block;
}
.bk-root .slick-header {
  overflow: hidden;
  position: relative;
}
.bk-root .slick-headerrow {
  overflow: hidden;
  position: relative;
}
.bk-root .slick-top-panel-scroller {
  overflow: hidden;
  position: relative;
}
.bk-root .slick-top-panel {
  width: 10000px;
}
.bk-root .slick-viewport {
  position: relative;
  outline: 0;
  width: 100%;
}
.bk-root .slick-header-columns {
  background: url('images/header-columns-bg.gif') repeat-x center bottom;
  border-bottom: 1px solid silver;
}
.bk-root .slick-header-column {
  background: url('images/header-columns-bg.gif') repeat-x center bottom;
  border-right: 1px solid silver;
}
.bk-root .slick-header-column:hover,
.bk-root .slick-header-column-active {
  background: white url('images/header-columns-over-bg.gif') repeat-x center bottom;
}
.bk-root .slick-headerrow {
  background: #fafafa;
}
.bk-root .slick-headerrow-column {
  background: #fafafa;
  border-bottom: 0;
  height: 100%;
}
.bk-root .slick-row.ui-state-active {
  background: #F5F7D7;
}
.bk-root .slick-row {
  position: absolute;
  background: white;
  border: 0px;
  line-height: 20px;
}
.bk-root .slick-row.selected {
  z-index: 10;
  background: #DFE8F6;
}
.bk-root .slick-cell {
  padding-left: 4px;
  padding-right: 4px;
}
.bk-root .slick-group {
  border-bottom: 2px solid silver;
}
.bk-root .slick-group-toggle {
  width: 9px;
  height: 9px;
  margin-right: 5px;
}
.bk-root .slick-group-toggle.expanded {
  background: url(images/collapse.gif) no-repeat center center;
}
.bk-root .slick-group-toggle.collapsed {
  background: url(images/expand.gif) no-repeat center center;
}
.bk-root .slick-group-totals {
  color: gray;
  background: white;
}
.bk-root .slick-group-select-checkbox {
  width: 13px;
  height: 13px;
  margin: 3px 10px 0 0;
  display: inline-block;
}
.bk-root .slick-group-select-checkbox.checked {
  background: url(images/GrpCheckboxY.png) no-repeat center center;
}
.bk-root .slick-group-select-checkbox.unchecked {
  background: url(images/GrpCheckboxN.png) no-repeat center center;
}
.bk-root .slick-cell.selected {
  background-color: beige;
}
.bk-root .slick-cell.active {
  border-color: gray;
  border-style: solid;
}
.bk-root .slick-sortable-placeholder {
  background: silver !important;
}
.bk-root .slick-row.odd {
  background: #fafafa;
}
.bk-root .slick-row.ui-state-active {
  background: #F5F7D7;
}
.bk-root .slick-row.loading {
  opacity: 0.5;
}
.bk-root .slick-cell.invalid {
  border-color: red;
  -moz-animation-duration: 0.2s;
  -webkit-animation-duration: 0.2s;
  -moz-animation-name: slickgrid-invalid-hilite;
  -webkit-animation-name: slickgrid-invalid-hilite;
}
@-moz-keyframes slickgrid-invalid-hilite {
  from {
    box-shadow: 0 0 6px red;
  }
  to {
    box-shadow: none;
  }
}
@-webkit-keyframes slickgrid-invalid-hilite {
  from {
    box-shadow: 0 0 6px red;
  }
  to {
    box-shadow: none;
  }
}
.bk-root .slick-column-name,
.bk-root .slick-sort-indicator {
  /**
   * This makes all "float:right" elements after it that spill over to the next line
   * display way below the lower boundary of the column thus hiding them.
   */
  display: inline-block;
  float: left;
  margin-bottom: 100px;
}
.bk-root .slick-header-button {
  display: inline-block;
  float: right;
  vertical-align: top;
  margin: 1px;
  /**
  * This makes all "float:right" elements after it that spill over to the next line
  * display way below the lower boundary of the column thus hiding them.
  */
  margin-bottom: 100px;
  height: 15px;
  width: 15px;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
}
.bk-root .slick-header-button-hidden {
  width: 0;
  -webkit-transition: 0.2s width;
  -ms-transition: 0.2s width;
  transition: 0.2s width;
}
.bk-root .slick-header-column:hover > .slick-header-button {
  width: 15px;
}
.bk-root .slick-header-menubutton {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 14px;
  background-repeat: no-repeat;
  background-position: left center;
  background-image: url(../images/down.gif);
  cursor: pointer;
  display: none;
  border-left: thin ridge silver;
}
.bk-root .slick-header-column:hover > .slick-header-menubutton,
.bk-root .slick-header-column-active .slick-header-menubutton {
  display: inline-block;
}
.bk-root .slick-header-menu {
  position: absolute;
  display: inline-block;
  margin: 0;
  padding: 2px;
  cursor: default;
}
.bk-root .slick-header-menuitem {
  list-style: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
}
.bk-root .slick-header-menuicon {
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 4px;
  background-repeat: no-repeat;
  background-position: center center;
}
.bk-root .slick-header-menucontent {
  display: inline-block;
  vertical-align: middle;
}
.bk-root .slick-header-menuitem-disabled {
  color: silver;
}
.bk-root .slick-header-menuitem.slick-header-menuitem-divider {
  cursor: default;
  border: none;
  overflow: hidden;
  padding: 0;
  height: 1px;
  margin: 8px 2px;
  background-color: #cecece;
}
.bk-root .slick-header-menuitem-divider.slick-header-menuitem:hover {
  background-color: #cecece;
}
.bk-root .slick-columnpicker {
  border: 1px solid #718BB7;
  background: #f0f0f0;
  padding: 6px;
  -moz-box-shadow: 2px 2px 2px silver;
  -webkit-box-shadow: 2px 2px 2px silver;
  box-shadow: 2px 2px 2px silver;
  min-width: 150px;
  cursor: default;
  position: absolute;
  z-index: 20;
  overflow: auto;
  resize: both;
}
.bk-root .slick-columnpicker > .close {
  float: right;
}
.bk-root .slick-columnpicker .title {
  font-size: 16px;
  width: 60%;
  border-bottom: solid 1px #d6d6d6;
  margin-bottom: 10px;
}
.bk-root .slick-columnpicker li {
  list-style: none;
  margin: 0;
  padding: 0;
  background: none;
}
.bk-root .slick-columnpicker input {
  margin: 4px;
}
.bk-root .slick-columnpicker li a {
  display: block;
  padding: 4px;
  font-weight: bold;
}
.bk-root .slick-columnpicker li a:hover {
  background: white;
}
.bk-root .slick-columnpicker-list li.hidden {
  display: none;
}
.bk-root .slick-pager {
  width: 100%;
  height: 26px;
  border: 1px solid gray;
  border-top: 0;
  background: url('../images/header-columns-bg.gif') repeat-x center bottom;
  vertical-align: middle;
}
.bk-root .slick-pager .slick-pager-status {
  display: inline-block;
  padding: 6px;
}
.bk-root .slick-pager .ui-icon-container {
  display: inline-block;
  margin: 2px;
  border-color: gray;
}
.bk-root .slick-pager .slick-pager-nav {
  display: inline-block;
  float: left;
  padding: 2px;
}
.bk-root .slick-pager .slick-pager-settings {
  display: block;
  float: right;
  padding: 2px;
}
.bk-root .slick-pager .slick-pager-settings * {
  vertical-align: middle;
}
.bk-root .slick-pager .slick-pager-settings a {
  padding: 2px;
  text-decoration: underline;
  cursor: pointer;
}
.bk-root .slick-header-columns {
  border-bottom: 1px solid silver;
  background-image: none;
}
.bk-root .slick-header-column {
  border-right: 1px solid transparent;
  background-image: none;
}
.bk-root .slick-header-column:last-of-type {
  border-right-color: transparent;
}
.bk-root .slick-header-column:hover,
.bk-root .slick-header-column-active {
  background-color: #F0F8FF;
  background-image: none;
}
.bk-root .slick-group-toggle.expanded {
  background-image: url("data:image/gif;base64,R0lGODlhCQAJAPcAAAFGeoCAgNXz/+v5/+v6/+z5/+36//L7//X8//j9/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAACQAJAAAIMwADCBxIUIDBgwIEChgwwECBAgQUFjBAkaJCABgxGlB4AGHCAAIQiBypEEECkScJqgwQEAA7");
}
.bk-root .slick-group-toggle.collapsed {
  background-image: url("data:image/gif;base64,R0lGODlhCQAJAPcAAAFGeoCAgNXz/+v5/+v6/+z5/+36//L7//X8//j9/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAACQAJAAAIOAADCBxIUIDBgwIEChgwAECBAgQUFjAAQIABAwoBaNSIMYCAAwIqGlSIAEHFkiQTIBCgkqDLAAEBADs=");
}
.bk-root .slick-group-select-checkbox.checked {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAIAAACQKrqGAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xNkRpr/UAAAEcSURBVChTjdI9S8NQFAbg/raQXVwCRRFE7GK7OXTwD+ikk066VF3a0ja0hQTyQdJrwNq0zrYSQRLEXMSWSlCIb8glqRcFD+9yz3nugXwU4n9XQqMoGjj36uBJsTwuaNo3EwBG4Yy7pe7Gv8YcvhJCGFVsjxsjxujj6OTSGlHv+U2WZUZbPWKOv1ZjT5a7pbIoiptbO5b73mwrjHa1B27l8VlTEIS1damlTnEE+EEN9/P8WrfH81qdAIGeXvTTmzltdCy46sEhxpKUINReZR9NnqZbr9puugxV3NjWh/k74WmmEdWhmUNy2jNmWRc6fZTVADCqao52u+DGWTACYNT3fRxwtatPufTNR4yCIGAUn5hS+vJHhWGY/ANx/A3tvdv+1tZmuwAAAABJRU5ErkJggg==");
}
.bk-root .slick-group-select-checkbox.unchecked {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAIAAACQKrqGAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xNkRpr/UAAACXSURBVChT1dIxC4MwEAXg/v8/VOhQVDBNakV0KA6pxS4JhWRSIYPEJxwdDi1de7wleR+3JIf486w0hKCKRpSvvOhZcCmvNQBRuKqdah03U7UjNNH81rOaBYDo8SQaPX8JANFEaLaGBeAPaaY61rGksiN6TmR5H1j9CSoAosYYHLA7vTxYMvVEZa0liif23r93xjm3/oEYF8PiDn/I2FHCAAAAAElFTkSuQmCC");
}
.bk-root .slick-sort-indicator-desc {
  background-image: url("data:image/gif;base64,R0lGODlhDQAFAIcAAGGQzUD/QOPu+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAMAAAEALAAAAAANAAUAAAgeAAUAGEgQgIAACBEKLHgwYcKFBh1KFNhQosOKEgMCADs=");
}
.bk-root .slick-sort-indicator-asc {
  background-image: url("data:image/gif;base64,R0lGODlhDQAFAIcAAGGQzUD/QOPu+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAMAAAEALAAAAAANAAUAAAgbAAMIDABgoEGDABIeRJhQ4cKGEA8KmEiRosGAADs=");
}
.bk-root .slick-header-menubutton {
  background-image: url("data:image/gif;base64,R0lGODlhDgAOAIABADtKYwAAACH5BAEAAAEALAAAAAAOAA4AAAISjI+py+0PHZgUsGobhTn6DxoFADs=");
}
.bk-root .slick-pager {
  background-image: none;
}
`;
export default css;
