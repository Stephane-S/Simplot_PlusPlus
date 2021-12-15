const css = `
.bk-root .bk-menu-icon {
  width: 28px;
  height: 28px;
  background-size: 60%;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center center;
}
.bk-root .bk-context-menu {
  position: absolute;
  display: inline-flex;
  display: -webkit-inline-flex;
  flex-wrap: nowrap;
  -webkit-flex-wrap: nowrap;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  width: auto;
  height: auto;
  z-index: 100;
  cursor: pointer;
  font-size: 12px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
}
.bk-root .bk-context-menu.bk-horizontal {
  flex-direction: row;
  -webkit-flex-direction: row;
}
.bk-root .bk-context-menu.bk-vertical {
  flex-direction: column;
  -webkit-flex-direction: column;
}
.bk-root .bk-context-menu > .bk-divider {
  cursor: default;
  overflow: hidden;
  background-color: #e5e5e5;
}
.bk-root .bk-context-menu.bk-horizontal > .bk-divider {
  width: 1px;
  margin: 5px 0;
}
.bk-root .bk-context-menu.bk-vertical > .bk-divider {
  height: 1px;
  margin: 0 5px;
}
.bk-root .bk-context-menu > :not(.bk-divider) {
  border: 1px solid transparent;
}
.bk-root .bk-context-menu > :not(.bk-divider).bk-active {
  border-color: #26aae1;
}
.bk-root .bk-context-menu > :not(.bk-divider):hover {
  background-color: #f9f9f9;
}
.bk-root .bk-context-menu.bk-horizontal > :not(.bk-divider):first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.bk-root .bk-context-menu.bk-horizontal > :not(.bk-divider):last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.bk-root .bk-context-menu.bk-vertical > :not(.bk-divider):first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.bk-root .bk-context-menu.bk-vertical > :not(.bk-divider):last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.bk-root .bk-menu {
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 100;
  cursor: pointer;
  font-size: 12px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
}
.bk-root .bk-menu.bk-above {
  bottom: 100%;
}
.bk-root .bk-menu.bk-below {
  top: 100%;
}
.bk-root .bk-menu > .bk-divider {
  height: 1px;
  margin: 7.5px 0;
  overflow: hidden;
  background-color: #e5e5e5;
}
.bk-root .bk-menu > :not(.bk-divider) {
  padding: 6px 12px;
}
.bk-root .bk-menu > :not(.bk-divider):hover,
.bk-root .bk-menu > :not(.bk-divider).bk-active {
  background-color: #e6e6e6;
}
.bk-root .bk-caret {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin: 0 5px;
}
.bk-root .bk-caret.bk-down {
  border-top: 4px solid;
}
.bk-root .bk-caret.bk-up {
  border-bottom: 4px solid;
}
.bk-root .bk-caret.bk-down,
.bk-root .bk-caret.bk-up {
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
}
.bk-root .bk-caret.bk-left {
  border-right: 4px solid;
}
.bk-root .bk-caret.bk-right {
  border-left: 4px solid;
}
.bk-root .bk-caret.bk-left,
.bk-root .bk-caret.bk-right {
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}
`;
export default css;
