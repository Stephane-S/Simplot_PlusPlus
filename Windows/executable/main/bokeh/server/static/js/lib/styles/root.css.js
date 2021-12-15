const css = `
.bk-root {
  position: relative;
  width: auto;
  height: auto;
  z-index: 0;
  box-sizing: border-box;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 13px;
}
.bk-root .bk,
.bk-root .bk:before,
.bk-root .bk:after {
  box-sizing: inherit;
  margin: 0;
  border: 0;
  padding: 0;
  background-image: none;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.42857143;
}
.bk-root pre.bk {
  font-family: Courier, monospace;
}
`;
export default css;
