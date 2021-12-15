const css = `
.bk-root .bk-data-table {
  box-sizing: content-box;
  font-size: 11px;
}
.bk-root .bk-data-table input[type="checkbox"] {
  margin-left: 4px;
  margin-right: 4px;
}
.bk-root .bk-cell-special-defaults {
  border-right-color: silver;
  border-right-style: solid;
  background: #f5f5f5;
}
.bk-root .bk-cell-select {
  border-right-color: silver;
  border-right-style: solid;
  background: #f5f5f5;
}
.bk-root .slick-cell.bk-cell-index {
  border-right-color: silver;
  border-right-style: solid;
  background: #f5f5f5;
  text-align: right;
  background: #f0f0f0;
  color: #909090;
}
.bk-root .bk-header-index .slick-column-name {
  float: right;
}
.bk-root .slick-row.selected .bk-cell-index {
  background-color: transparent;
}
.bk-root .slick-row.odd {
  background: #f0f0f0;
}
.bk-root .slick-cell {
  padding-left: 4px;
  padding-right: 4px;
  border-right-color: transparent;
  border: 0.25px solid transparent;
}
.bk-root .slick-cell .bk {
  line-height: inherit;
}
.bk-root .slick-cell.active {
  border-style: dashed;
}
.bk-root .slick-cell.selected {
  background-color: #F0F8FF;
}
.bk-root .slick-cell.editable {
  padding-left: 0;
  padding-right: 0;
}
.bk-root .bk-cell-editor {
  display: contents;
}
.bk-root .bk-cell-editor input,
.bk-root .bk-cell-editor select {
  width: 100%;
  height: 100%;
  border: 0;
  margin: 0;
  padding: 0;
  outline: 0;
  background: transparent;
  vertical-align: baseline;
}
.bk-root .bk-cell-editor input {
  padding-left: 4px;
  padding-right: 4px;
}
.bk-root .bk-cell-editor-completion {
  font-size: 11px;
}
`;
export default css;
