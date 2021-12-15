const css = `
.bk-root .bk-tabs-header {
  display: flex;
  display: -webkit-flex;
  flex-wrap: nowrap;
  -webkit-flex-wrap: nowrap;
  align-items: center;
  -webkit-align-items: center;
  overflow: hidden;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.bk-root .bk-tabs-header .bk-btn-group {
  height: auto;
  margin-right: 5px;
}
.bk-root .bk-tabs-header .bk-btn-group > .bk-btn {
  flex-grow: 0;
  -webkit-flex-grow: 0;
  height: auto;
  padding: 4px 4px;
}
.bk-root .bk-tabs-header .bk-headers-wrapper {
  flex-grow: 1;
  -webkit-flex-grow: 1;
  overflow: hidden;
  color: #666666;
}
.bk-root .bk-tabs-header.bk-above .bk-headers-wrapper {
  border-bottom: 1px solid #e6e6e6;
}
.bk-root .bk-tabs-header.bk-right .bk-headers-wrapper {
  border-left: 1px solid #e6e6e6;
}
.bk-root .bk-tabs-header.bk-below .bk-headers-wrapper {
  border-top: 1px solid #e6e6e6;
}
.bk-root .bk-tabs-header.bk-left .bk-headers-wrapper {
  border-right: 1px solid #e6e6e6;
}
.bk-root .bk-tabs-header.bk-above,
.bk-root .bk-tabs-header.bk-below {
  flex-direction: row;
  -webkit-flex-direction: row;
}
.bk-root .bk-tabs-header.bk-above .bk-headers,
.bk-root .bk-tabs-header.bk-below .bk-headers {
  flex-direction: row;
  -webkit-flex-direction: row;
}
.bk-root .bk-tabs-header.bk-left,
.bk-root .bk-tabs-header.bk-right {
  flex-direction: column;
  -webkit-flex-direction: column;
}
.bk-root .bk-tabs-header.bk-left .bk-headers,
.bk-root .bk-tabs-header.bk-right .bk-headers {
  flex-direction: column;
  -webkit-flex-direction: column;
}
.bk-root .bk-tabs-header .bk-headers {
  position: relative;
  display: flex;
  display: -webkit-flex;
  flex-wrap: nowrap;
  -webkit-flex-wrap: nowrap;
  align-items: center;
  -webkit-align-items: center;
}
.bk-root .bk-tabs-header .bk-tab {
  padding: 4px 8px;
  border: solid transparent;
  white-space: nowrap;
  cursor: pointer;
}
.bk-root .bk-tabs-header .bk-tab:hover {
  background-color: #f2f2f2;
}
.bk-root .bk-tabs-header .bk-tab.bk-active {
  color: #4d4d4d;
  background-color: white;
  border-color: #e6e6e6;
}
.bk-root .bk-tabs-header .bk-tab .bk-close {
  margin-left: 10px;
}
.bk-root .bk-tabs-header.bk-above .bk-tab {
  border-width: 3px 1px 0px 1px;
  border-radius: 4px 4px 0 0;
}
.bk-root .bk-tabs-header.bk-right .bk-tab {
  border-width: 1px 3px 1px 0px;
  border-radius: 0 4px 4px 0;
}
.bk-root .bk-tabs-header.bk-below .bk-tab {
  border-width: 0px 1px 3px 1px;
  border-radius: 0 0 4px 4px;
}
.bk-root .bk-tabs-header.bk-left .bk-tab {
  border-width: 1px 0px 1px 3px;
  border-radius: 4px 0 0 4px;
}
.bk-root .bk-close {
  display: inline-block;
  width: 10px;
  height: 10px;
  vertical-align: middle;
  background-image: url('data:image/svg+xml;utf8,\
      <svg viewPort="0 0 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg">\
        <line x1="1" y1="9" x2="9" y2="1" stroke="gray" stroke-width="2"/>\
        <line x1="1" y1="1" x2="9" y2="9" stroke="gray" stroke-width="2"/>\
      </svg>');
}
.bk-root .bk-close:hover {
  background-image: url('data:image/svg+xml;utf8,\
      <svg viewPort="0 0 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg">\
        <line x1="1" y1="9" x2="9" y2="1" stroke="red" stroke-width="2"/>\
        <line x1="1" y1="1" x2="9" y2="9" stroke="red" stroke-width="2"/>\
      </svg>');
}
`;
export default css;
