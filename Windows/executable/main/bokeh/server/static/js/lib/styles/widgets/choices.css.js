const css = `
.bk-root {
  /*===============================
=            Choices            =
===============================*/
  /*=====  End of Choices  ======*/
}
.bk-root .choices {
  position: relative;
  margin-bottom: 24px;
  font-size: 16px;
}
.bk-root .choices:focus {
  outline: none;
}
.bk-root .choices:last-child {
  margin-bottom: 0;
}
.bk-root .choices.is-disabled .choices__inner,
.bk-root .choices.is-disabled .choices__input {
  background-color: #eaeaea;
  cursor: not-allowed;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.bk-root .choices.is-disabled .choices__item {
  cursor: not-allowed;
}
.bk-root .choices [hidden] {
  display: none !important;
}
.bk-root .choices[data-type*='select-one'] {
  cursor: pointer;
}
.bk-root .choices[data-type*='select-one'] .choices__inner {
  padding-bottom: 7.5px;
}
.bk-root .choices[data-type*='select-one'] .choices__input {
  display: block;
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid #dddddd;
  background-color: #ffffff;
  margin: 0;
}
.bk-root .choices[data-type*='select-one'] .choices__button {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMSAyMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yLjU5Mi4wNDRsMTguMzY0IDE4LjM2NC0yLjU0OCAyLjU0OEwuMDQ0IDIuNTkyeiIvPjxwYXRoIGQ9Ik0wIDE4LjM2NEwxOC4zNjQgMGwyLjU0OCAyLjU0OEwyLjU0OCAyMC45MTJ6Ii8+PC9nPjwvc3ZnPg==);
  padding: 0;
  background-size: 8px;
  position: absolute;
  top: 50%;
  right: 0;
  margin-top: -10px;
  margin-right: 25px;
  height: 20px;
  width: 20px;
  border-radius: 10em;
  opacity: 0.5;
}
.bk-root .choices[data-type*='select-one'] .choices__button:hover,
.bk-root .choices[data-type*='select-one'] .choices__button:focus {
  opacity: 1;
}
.bk-root .choices[data-type*='select-one'] .choices__button:focus {
  box-shadow: 0px 0px 0px 2px #00bcd4;
}
.bk-root .choices[data-type*='select-one'] .choices__item[data-value=''] .choices__button {
  display: none;
}
.bk-root .choices[data-type*='select-one']:after {
  content: '';
  height: 0;
  width: 0;
  border-style: solid;
  border-color: #333333 transparent transparent transparent;
  border-width: 5px;
  position: absolute;
  right: 11.5px;
  top: 50%;
  margin-top: -2.5px;
  pointer-events: none;
}
.bk-root .choices[data-type*='select-one'].is-open:after {
  border-color: transparent transparent #333333 transparent;
  margin-top: -7.5px;
}
.bk-root .choices[data-type*='select-one'][dir='rtl']:after {
  left: 11.5px;
  right: auto;
}
.bk-root .choices[data-type*='select-one'][dir='rtl'] .choices__button {
  right: auto;
  left: 0;
  margin-left: 25px;
  margin-right: 0;
}
.bk-root .choices[data-type*='select-multiple'] .choices__inner,
.bk-root .choices[data-type*='text'] .choices__inner {
  cursor: text;
}
.bk-root .choices[data-type*='select-multiple'] .choices__button,
.bk-root .choices[data-type*='text'] .choices__button {
  position: relative;
  display: inline-block;
  margin-top: 0;
  margin-right: -4px;
  margin-bottom: 0;
  margin-left: 8px;
  padding-left: 16px;
  border-left: 1px solid #008fa1;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMSAyMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yLjU5Mi4wNDRsMTguMzY0IDE4LjM2NC0yLjU0OCAyLjU0OEwuMDQ0IDIuNTkyeiIvPjxwYXRoIGQ9Ik0wIDE4LjM2NEwxOC4zNjQgMGwyLjU0OCAyLjU0OEwyLjU0OCAyMC45MTJ6Ii8+PC9nPjwvc3ZnPg==);
  background-size: 8px;
  width: 8px;
  line-height: 1;
  opacity: 0.75;
  border-radius: 0;
}
.bk-root .choices[data-type*='select-multiple'] .choices__button:hover,
.bk-root .choices[data-type*='select-multiple'] .choices__button:focus,
.bk-root .choices[data-type*='text'] .choices__button:hover,
.bk-root .choices[data-type*='text'] .choices__button:focus {
  opacity: 1;
}
.bk-root .choices__inner {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  background-color: #f9f9f9;
  padding: 7.5px 7.5px 3.75px;
  border: 1px solid #dddddd;
  border-radius: 2.5px;
  font-size: 14px;
  min-height: 44px;
  overflow: hidden;
}
.bk-root .is-focused .choices__inner,
.bk-root .is-open .choices__inner {
  border-color: #b7b7b7;
}
.bk-root .is-open .choices__inner {
  border-radius: 2.5px 2.5px 0 0;
}
.bk-root .is-flipped.is-open .choices__inner {
  border-radius: 0 0 2.5px 2.5px;
}
.bk-root .choices__list {
  margin: 0;
  padding-left: 0;
  list-style: none;
}
.bk-root .choices__list--single {
  display: inline-block;
  padding: 4px 16px 4px 4px;
  width: 100%;
}
.bk-root [dir='rtl'] .choices__list--single {
  padding-right: 4px;
  padding-left: 16px;
}
.bk-root .choices__list--single .choices__item {
  width: 100%;
}
.bk-root .choices__list--multiple {
  display: inline;
}
.bk-root .choices__list--multiple .choices__item {
  display: inline-block;
  vertical-align: middle;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 3.75px;
  margin-bottom: 3.75px;
  background-color: #00bcd4;
  border: 1px solid #00a5bb;
  color: #ffffff;
  word-break: break-all;
  box-sizing: border-box;
}
.bk-root .choices__list--multiple .choices__item[data-deletable] {
  padding-right: 5px;
}
.bk-root [dir='rtl'] .choices__list--multiple .choices__item {
  margin-right: 0;
  margin-left: 3.75px;
}
.bk-root .choices__list--multiple .choices__item.is-highlighted {
  background-color: #00a5bb;
  border: 1px solid #008fa1;
}
.bk-root .is-disabled .choices__list--multiple .choices__item {
  background-color: #aaaaaa;
  border: 1px solid #919191;
}
.bk-root .choices__list--dropdown {
  visibility: hidden;
  z-index: 1;
  position: absolute;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #dddddd;
  top: 100%;
  margin-top: -1px;
  border-bottom-left-radius: 2.5px;
  border-bottom-right-radius: 2.5px;
  overflow: hidden;
  word-break: break-all;
  will-change: visibility;
}
.bk-root .choices__list--dropdown.is-active {
  visibility: visible;
}
.bk-root .is-open .choices__list--dropdown {
  border-color: #b7b7b7;
}
.bk-root .is-flipped .choices__list--dropdown {
  top: auto;
  bottom: 100%;
  margin-top: 0;
  margin-bottom: -1px;
  border-radius: 0.25rem 0.25rem 0 0;
}
.bk-root .choices__list--dropdown .choices__list {
  position: relative;
  max-height: 300px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  will-change: scroll-position;
}
.bk-root .choices__list--dropdown .choices__item {
  position: relative;
  padding: 10px;
  font-size: 14px;
}
.bk-root [dir='rtl'] .choices__list--dropdown .choices__item {
  text-align: right;
}
@media (min-width: 640px) {
  .bk-root .choices__list--dropdown .choices__item--selectable {
    padding-right: 100px;
  }
  .bk-root .choices__list--dropdown .choices__item--selectable:after {
    content: attr(data-select-text);
    font-size: 12px;
    opacity: 0;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  .bk-root [dir='rtl'] .choices__list--dropdown .choices__item--selectable {
    text-align: right;
    padding-left: 100px;
    padding-right: 10px;
  }
  .bk-root [dir='rtl'] .choices__list--dropdown .choices__item--selectable:after {
    right: auto;
    left: 10px;
  }
}
.bk-root .choices__list--dropdown .choices__item--selectable.is-highlighted {
  background-color: #f2f2f2;
}
.bk-root .choices__list--dropdown .choices__item--selectable.is-highlighted:after {
  opacity: 0.5;
}
.bk-root .choices__item {
  cursor: default;
}
.bk-root .choices__item--selectable {
  cursor: pointer;
}
.bk-root .choices__item--disabled {
  cursor: not-allowed;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  opacity: 0.5;
}
.bk-root .choices__heading {
  font-weight: 600;
  font-size: 12px;
  padding: 10px;
  border-bottom: 1px solid #f7f7f7;
  color: gray;
}
.bk-root .choices__button {
  text-indent: -9999px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 0;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.bk-root .choices__button:focus {
  outline: none;
}
.bk-root .choices__input {
  display: inline-block;
  vertical-align: baseline;
  background-color: #f9f9f9;
  font-size: 14px;
  margin-bottom: 5px;
  border: 0;
  border-radius: 0;
  max-width: 100%;
  padding: 4px 0 4px 2px;
}
.bk-root .choices__input:focus {
  outline: 0;
}
.bk-root [dir='rtl'] .choices__input {
  padding-right: 2px;
  padding-left: 0;
}
.bk-root .choices__placeholder {
  opacity: 0.5;
}
.bk-root .choices {
  width: 100%;
}
.bk-root .choices {
  box-sizing: border-box;
}
.bk-root .choices *,
.bk-root .choices *:before,
.bk-root .choices *:after {
  box-sizing: inherit;
}
.bk-root .choices__inner .choices__item.light {
  background-color: rgba(0, 126, 255, 0.08);
  border-radius: 5px;
  border: 1px solid rgba(0, 126, 255, 0.24);
  color: #007eff;
}
.bk-root .choices__inner .choices__item.solid {
  background-color: #1f77b4;
  border: none;
  border-radius: 5px;
  color: white;
}
.bk-root .choices__inner .choices__item.solid .is-highlighted {
  background-color: #1f77b4;
  border: none;
}
.bk-root .choices__input {
  background-color: transparent;
}
.bk-root .choices__inner {
  background: transparent;
  border: 1px solid darkgray;
  border-radius: 5px;
  min-height: unset;
}
.bk-root .choices__list {
  white-space: initial;
}
.bk-root .choices[data-type*=select-multiple] .choices__button.light {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMSAyMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMDA3ZWZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yLjU5Mi4wNDRsMTguMzY0IDE4LjM2NC0yLjU0OCAyLjU0OEwuMDQ0IDIuNTkyeiIvPjxwYXRoIGQ9Ik0wIDE4LjM2NEwxOC4zNjQgMGwyLjU0OCAyLjU0OEwyLjU0OCAyMC45MTJ6Ii8+PC9nPjwvc3ZnPg==);
}
.bk-root .choices[data-type*=select-multiple] .choices__button.solid {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMSAyMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yLjU5Mi4wNDRsMTguMzY0IDE4LjM2NC0yLjU0OCAyLjU0OEwuMDQ0IDIuNTkyeiIvPjxwYXRoIGQ9Ik0wIDE4LjM2NEwxOC4zNjQgMGwyLjU0OCAyLjU0OEwyLjU0OCAyMC45MTJ6Ii8+PC9nPjwvc3ZnPg==);
  border-left: 1px solid white;
  opacity: 1;
}
`;
export default css;
