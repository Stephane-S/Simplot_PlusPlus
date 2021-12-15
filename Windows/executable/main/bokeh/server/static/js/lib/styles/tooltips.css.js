const css = `
.bk-root {
  /* Same border color used everywhere */
  /* Gray of icons */
}
.bk-root .bk-tooltip {
  font-weight: 300;
  font-size: 12px;
  position: absolute;
  padding: 5px;
  border: 1px solid #e5e5e5;
  color: #2f2f2f;
  background-color: white;
  pointer-events: none;
  opacity: 0.95;
  z-index: 100;
}
.bk-root .bk-tooltip > div:not(:first-child) {
  /* gives space when multiple elements are being hovered over */
  margin-top: 5px;
  border-top: #e5e5e5 1px dashed;
}
.bk-root .bk-tooltip.bk-left.bk-tooltip-arrow::before {
  position: absolute;
  margin: -7px 0 0 0;
  top: 50%;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 7px 0 7px 0;
  border-color: transparent;
  content: " ";
  display: block;
  left: -10px;
  border-right-width: 10px;
  border-right-color: #909599;
}
.bk-root .bk-tooltip.bk-left::before {
  left: -10px;
  border-right-width: 10px;
  border-right-color: #909599;
}
.bk-root .bk-tooltip.bk-right.bk-tooltip-arrow::after {
  position: absolute;
  margin: -7px 0 0 0;
  top: 50%;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 7px 0 7px 0;
  border-color: transparent;
  content: " ";
  display: block;
  right: -10px;
  border-left-width: 10px;
  border-left-color: #909599;
}
.bk-root .bk-tooltip.bk-right::after {
  right: -10px;
  border-left-width: 10px;
  border-left-color: #909599;
}
.bk-root .bk-tooltip.bk-above::before {
  position: absolute;
  margin: 0 0 0 -7px;
  left: 50%;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 7px 0 7px;
  border-color: transparent;
  content: " ";
  display: block;
  top: -10px;
  border-bottom-width: 10px;
  border-bottom-color: #909599;
}
.bk-root .bk-tooltip.bk-below::after {
  position: absolute;
  margin: 0 0 0 -7px;
  left: 50%;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 7px 0 7px;
  border-color: transparent;
  content: " ";
  display: block;
  bottom: -10px;
  border-top-width: 10px;
  border-top-color: #909599;
}
.bk-root .bk-tooltip-row-label {
  text-align: right;
  color: #26aae1;
  /* blue from toolbar highlighting */
}
.bk-root .bk-tooltip-row-value {
  color: default;
  /* seems to be necessary for notebook */
}
.bk-root .bk-tooltip-color-block {
  width: 12px;
  height: 12px;
  margin-left: 5px;
  margin-right: 5px;
  outline: #dddddd solid 1px;
  display: inline-block;
}
`;
export default css;
