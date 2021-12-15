const css = `
.bk-root .bk-btn {
  height: 100%;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  cursor: pointer;
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  outline: 0;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.bk-root .bk-btn:hover,
.bk-root .bk-btn:focus {
  text-decoration: none;
}
.bk-root .bk-btn:active,
.bk-root .bk-btn.bk-active {
  background-image: none;
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
}
.bk-root .bk-btn[disabled] {
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.65;
  box-shadow: none;
}
.bk-root .bk-btn-default {
  color: #333;
  background-color: #fff;
  border-color: #ccc;
}
.bk-root .bk-btn-default:hover {
  background-color: #f5f5f5;
  border-color: #b8b8b8;
}
.bk-root .bk-btn-default.bk-active {
  background-color: #ebebeb;
  border-color: #adadad;
}
.bk-root .bk-btn-default[disabled],
.bk-root .bk-btn-default[disabled]:hover,
.bk-root .bk-btn-default[disabled]:focus,
.bk-root .bk-btn-default[disabled]:active,
.bk-root .bk-btn-default[disabled].bk-active {
  background-color: #e6e6e6;
  border-color: #ccc;
}
.bk-root .bk-btn-primary {
  color: #fff;
  background-color: #428bca;
  border-color: #357ebd;
}
.bk-root .bk-btn-primary:hover {
  background-color: #3681c1;
  border-color: #2c699e;
}
.bk-root .bk-btn-primary.bk-active {
  background-color: #3276b1;
  border-color: #285e8e;
}
.bk-root .bk-btn-primary[disabled],
.bk-root .bk-btn-primary[disabled]:hover,
.bk-root .bk-btn-primary[disabled]:focus,
.bk-root .bk-btn-primary[disabled]:active,
.bk-root .bk-btn-primary[disabled].bk-active {
  background-color: #506f89;
  border-color: #357ebd;
}
.bk-root .bk-btn-success {
  color: #fff;
  background-color: #5cb85c;
  border-color: #4cae4c;
}
.bk-root .bk-btn-success:hover {
  background-color: #4eb24e;
  border-color: #409240;
}
.bk-root .bk-btn-success.bk-active {
  background-color: #47a447;
  border-color: #398439;
}
.bk-root .bk-btn-success[disabled],
.bk-root .bk-btn-success[disabled]:hover,
.bk-root .bk-btn-success[disabled]:focus,
.bk-root .bk-btn-success[disabled]:active,
.bk-root .bk-btn-success[disabled].bk-active {
  background-color: #667b66;
  border-color: #4cae4c;
}
.bk-root .bk-btn-warning {
  color: #fff;
  background-color: #f0ad4e;
  border-color: #eea236;
}
.bk-root .bk-btn-warning:hover {
  background-color: #eea43b;
  border-color: #e89014;
}
.bk-root .bk-btn-warning.bk-active {
  background-color: #ed9c28;
  border-color: #d58512;
}
.bk-root .bk-btn-warning[disabled],
.bk-root .bk-btn-warning[disabled]:hover,
.bk-root .bk-btn-warning[disabled]:focus,
.bk-root .bk-btn-warning[disabled]:active,
.bk-root .bk-btn-warning[disabled].bk-active {
  background-color: #c89143;
  border-color: #eea236;
}
.bk-root .bk-btn-danger {
  color: #fff;
  background-color: #d9534f;
  border-color: #d43f3a;
}
.bk-root .bk-btn-danger:hover {
  background-color: #d5433e;
  border-color: #bd2d29;
}
.bk-root .bk-btn-danger.bk-active {
  background-color: #d2322d;
  border-color: #ac2925;
}
.bk-root .bk-btn-danger[disabled],
.bk-root .bk-btn-danger[disabled]:hover,
.bk-root .bk-btn-danger[disabled]:focus,
.bk-root .bk-btn-danger[disabled]:active,
.bk-root .bk-btn-danger[disabled].bk-active {
  background-color: #a55350;
  border-color: #d43f3a;
}
.bk-root .bk-btn-group {
  height: 100%;
  display: flex;
  display: -webkit-flex;
  flex-wrap: nowrap;
  -webkit-flex-wrap: nowrap;
  align-items: center;
  -webkit-align-items: center;
  flex-direction: row;
  -webkit-flex-direction: row;
}
.bk-root .bk-btn-group > .bk-btn {
  flex-grow: 1;
  -webkit-flex-grow: 1;
}
.bk-root .bk-btn-group > .bk-btn + .bk-btn {
  margin-left: -1px;
}
.bk-root .bk-btn-group > .bk-btn:first-child:not(:last-child) {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}
.bk-root .bk-btn-group > .bk-btn:not(:first-child):last-child {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}
.bk-root .bk-btn-group > .bk-btn:not(:first-child):not(:last-child) {
  border-radius: 0;
}
.bk-root .bk-btn-group .bk-dropdown-toggle {
  flex: 0 0 0;
  -webkit-flex: 0 0 0;
  padding: 6px 6px;
}
`;
export default css;
