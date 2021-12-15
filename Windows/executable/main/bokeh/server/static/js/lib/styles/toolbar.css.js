const css = `
.bk-root .bk-toolbar-hidden {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0.3s linear, opacity 0.3s linear;
}
.bk-root .bk-toolbar,
.bk-root .bk-button-bar {
  display: flex;
  display: -webkit-flex;
  flex-wrap: nowrap;
  -webkit-flex-wrap: nowrap;
  align-items: center;
  -webkit-align-items: center;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.bk-root .bk-toolbar .bk-logo {
  flex-shrink: 0;
  -webkit-flex-shrink: 0;
}
.bk-root .bk-toolbar.bk-above,
.bk-root .bk-toolbar.bk-below {
  flex-direction: row;
  -webkit-flex-direction: row;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
}
.bk-root .bk-toolbar.bk-above .bk-button-bar,
.bk-root .bk-toolbar.bk-below .bk-button-bar {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
}
.bk-root .bk-toolbar.bk-above .bk-logo,
.bk-root .bk-toolbar.bk-below .bk-logo {
  order: 1;
  -webkit-order: 1;
  margin-left: 5px;
  margin-right: 0px;
}
.bk-root .bk-toolbar.bk-left,
.bk-root .bk-toolbar.bk-right {
  flex-direction: column;
  -webkit-flex-direction: column;
  justify-content: flex-start;
  -webkit-justify-content: flex-start;
}
.bk-root .bk-toolbar.bk-left .bk-button-bar,
.bk-root .bk-toolbar.bk-right .bk-button-bar {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-flex-direction: column;
}
.bk-root .bk-toolbar.bk-left .bk-logo,
.bk-root .bk-toolbar.bk-right .bk-logo {
  order: 0;
  -webkit-order: 0;
  margin-bottom: 5px;
  margin-top: 0px;
}
.bk-root .bk-toolbar-button {
  width: 30px;
  height: 30px;
  cursor: pointer;
  background-size: 60% 60%;
  background-origin: border-box;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center center;
}
.bk-root .bk-toolbar-button:hover {
  background-color: rgba(192, 192, 192, 0.15);
}
.bk-root .bk-toolbar-button:focus {
  outline: none;
}
.bk-root .bk-toolbar-button::-moz-focus-inner {
  border: 0;
}
.bk-root .bk-toolbar.bk-above .bk-toolbar-button {
  border-bottom: 2px solid transparent;
}
.bk-root .bk-toolbar.bk-above .bk-toolbar-button.bk-active {
  border-bottom-color: #26aae1;
}
.bk-root .bk-toolbar.bk-below .bk-toolbar-button {
  border-top: 2px solid transparent;
}
.bk-root .bk-toolbar.bk-below .bk-toolbar-button.bk-active {
  border-top-color: #26aae1;
}
.bk-root .bk-toolbar.bk-right .bk-toolbar-button {
  border-left: 2px solid transparent;
}
.bk-root .bk-toolbar.bk-right .bk-toolbar-button.bk-active {
  border-left-color: #26aae1;
}
.bk-root .bk-toolbar.bk-left .bk-toolbar-button {
  border-right: 2px solid transparent;
}
.bk-root .bk-toolbar.bk-left .bk-toolbar-button.bk-active {
  border-right-color: #26aae1;
}
.bk-root .bk-button-bar + .bk-button-bar:before {
  content: " ";
  display: inline-block;
  background-color: lightgray;
}
.bk-root .bk-toolbar.bk-above .bk-button-bar + .bk-button-bar:before,
.bk-root .bk-toolbar.bk-below .bk-button-bar + .bk-button-bar:before {
  height: 10px;
  width: 1px;
}
.bk-root .bk-toolbar.bk-left .bk-button-bar + .bk-button-bar:before,
.bk-root .bk-toolbar.bk-right .bk-button-bar + .bk-button-bar:before {
  height: 1px;
  width: 10px;
}
`;
export default css;
