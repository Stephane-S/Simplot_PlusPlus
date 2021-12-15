import { isBoolean, isString, isArray, isPlainObject } from "./util/types";
import { entries } from "./util/object";
const _createElement = (tag) => {
    return (attrs = {}, ...children) => {
        const element = document.createElement(tag);
        element.classList.add("bk");
        for (let [attr, value] of entries(attrs)) {
            if (value == null || isBoolean(value) && !value)
                continue;
            if (attr === "class") {
                if (isString(value))
                    value = value.split(/\s+/);
                if (isArray(value)) {
                    for (const cls of value) {
                        if (cls != null)
                            element.classList.add(cls);
                    }
                    continue;
                }
            }
            if (attr === "style" && isPlainObject(value)) {
                for (const [prop, data] of entries(value)) {
                    element.style[prop] = data;
                }
                continue;
            }
            if (attr === "data" && isPlainObject(value)) {
                for (const [key, data] of entries(value)) {
                    element.dataset[key] = data; // XXX: attrs needs a better type
                }
                continue;
            }
            element.setAttribute(attr, value);
        }
        function append(child) {
            if (isString(child))
                element.appendChild(document.createTextNode(child));
            else if (child instanceof Node)
                element.appendChild(child);
            else if (child instanceof NodeList || child instanceof HTMLCollection) {
                for (const el of child) {
                    element.appendChild(el);
                }
            }
            else if (child != null && child !== false)
                throw new Error(`expected a DOM element, string, false or null, got ${JSON.stringify(child)}`);
        }
        for (const child of children) {
            if (isArray(child)) {
                for (const _child of child)
                    append(_child);
            }
            else
                append(child);
        }
        return element;
    };
};
export function createElement(tag, attrs, ...children) {
    return _createElement(tag)(attrs, ...children);
}
export const div = _createElement("div"), span = _createElement("span"), canvas = _createElement("canvas"), link = _createElement("link"), style = _createElement("style"), a = _createElement("a"), p = _createElement("p"), i = _createElement("i"), pre = _createElement("pre"), button = _createElement("button"), label = _createElement("label"), input = _createElement("input"), select = _createElement("select"), option = _createElement("option"), optgroup = _createElement("optgroup"), textarea = _createElement("textarea");
export function nbsp() {
    return document.createTextNode("\u00a0");
}
export function append(element, ...children) {
    for (const child of children)
        element.appendChild(child);
}
export function remove(element) {
    const parent = element.parentNode;
    if (parent != null) {
        parent.removeChild(element);
    }
}
export const removeElement = remove;
export function replaceWith(element, replacement) {
    const parent = element.parentNode;
    if (parent != null) {
        parent.replaceChild(replacement, element);
    }
}
export function prepend(element, ...nodes) {
    const first = element.firstChild;
    for (const node of nodes) {
        element.insertBefore(node, first);
    }
}
export function empty(node, attrs = false) {
    let child;
    while (child = node.firstChild) {
        node.removeChild(child);
    }
    if (attrs && node instanceof Element) {
        for (const attr of node.attributes) {
            node.removeAttributeNode(attr);
        }
    }
}
export function display(element) {
    element.style.display = "";
}
export function undisplay(element) {
    element.style.display = "none";
}
export function show(element) {
    element.style.visibility = "";
}
export function hide(element) {
    element.style.visibility = "hidden";
}
export function offset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset - document.documentElement.clientTop,
        left: rect.left + window.pageXOffset - document.documentElement.clientLeft,
    };
}
export function matches(el, selector) {
    const p = Element.prototype;
    const f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector;
    return f.call(el, selector);
}
export function parent(el, selector) {
    let node = el;
    while (node = node.parentElement) {
        if (matches(node, selector))
            return node;
    }
    return null;
}
function num(value) {
    return parseFloat(value) || 0;
}
export function extents(el) {
    const style = getComputedStyle(el);
    return {
        border: {
            top: num(style.borderTopWidth),
            bottom: num(style.borderBottomWidth),
            left: num(style.borderLeftWidth),
            right: num(style.borderRightWidth),
        },
        margin: {
            top: num(style.marginTop),
            bottom: num(style.marginBottom),
            left: num(style.marginLeft),
            right: num(style.marginRight),
        },
        padding: {
            top: num(style.paddingTop),
            bottom: num(style.paddingBottom),
            left: num(style.paddingLeft),
            right: num(style.paddingRight),
        },
    };
}
export function size(el) {
    const rect = el.getBoundingClientRect();
    return {
        width: Math.ceil(rect.width),
        height: Math.ceil(rect.height),
    };
}
export function scroll_size(el) {
    return {
        width: Math.ceil(el.scrollWidth),
        height: Math.ceil(el.scrollHeight),
    };
}
export function outer_size(el) {
    const { margin: { left, right, top, bottom } } = extents(el);
    const { width, height } = size(el);
    return {
        width: Math.ceil(width + left + right),
        height: Math.ceil(height + top + bottom),
    };
}
export function content_size(el) {
    const { left, top } = el.getBoundingClientRect();
    const { padding } = extents(el);
    let width = 0;
    let height = 0;
    for (const child of el.children) {
        const rect = child.getBoundingClientRect();
        width = Math.max(width, Math.ceil(rect.left - left - padding.left + rect.width));
        height = Math.max(height, Math.ceil(rect.top - top - padding.top + rect.height));
    }
    return { width, height };
}
export function position(el, box, margin) {
    const { style } = el;
    style.left = `${box.x}px`;
    style.top = `${box.y}px`;
    style.width = `${box.width}px`;
    style.height = `${box.height}px`;
    if (margin == null)
        style.margin = "";
    else {
        const { top, right, bottom, left } = margin;
        style.margin = `${top}px ${right}px ${bottom}px ${left}px`;
    }
}
export function children(el) {
    return Array.from(el.children);
}
export class ClassList {
    constructor(el) {
        this.el = el;
        this.classList = el.classList;
    }
    get values() {
        const values = [];
        for (let i = 0; i < this.classList.length; i++) {
            const item = this.classList.item(i);
            if (item != null)
                values.push(item);
        }
        return values;
    }
    has(cls) {
        return this.classList.contains(cls);
    }
    add(...classes) {
        for (const cls of classes)
            this.classList.add(cls);
        return this;
    }
    remove(...classes) {
        for (const cls of classes)
            this.classList.remove(cls);
        return this;
    }
    clear() {
        for (const cls of this.values) {
            if (cls != "bk")
                this.classList.remove(cls);
        }
        return this;
    }
    toggle(cls, activate) {
        const add = activate != null ? activate : !this.has(cls);
        if (add)
            this.add(cls);
        else
            this.remove(cls);
        return this;
    }
}
ClassList.__name__ = "ClassList";
export function classes(el) {
    return new ClassList(el);
}
export function toggle_attribute(el, attr, state) {
    if (state == null) {
        state = !el.hasAttribute(attr);
    }
    if (state)
        el.setAttribute(attr, "true");
    else
        el.removeAttribute(attr);
}
export var Keys;
(function (Keys) {
    Keys[Keys["Backspace"] = 8] = "Backspace";
    Keys[Keys["Tab"] = 9] = "Tab";
    Keys[Keys["Enter"] = 13] = "Enter";
    Keys[Keys["Esc"] = 27] = "Esc";
    Keys[Keys["PageUp"] = 33] = "PageUp";
    Keys[Keys["PageDown"] = 34] = "PageDown";
    Keys[Keys["Left"] = 37] = "Left";
    Keys[Keys["Up"] = 38] = "Up";
    Keys[Keys["Right"] = 39] = "Right";
    Keys[Keys["Down"] = 40] = "Down";
    Keys[Keys["Delete"] = 46] = "Delete";
})(Keys || (Keys = {}));
export function undisplayed(el, fn) {
    const { display } = el.style;
    el.style.display = "none";
    try {
        return fn();
    }
    finally {
        el.style.display = display;
    }
}
export function unsized(el, fn) {
    return sized(el, {}, fn);
}
export function sized(el, size, fn) {
    const { width, height, position, display } = el.style;
    el.style.position = "absolute";
    el.style.display = "";
    el.style.width = size.width != null && size.width != Infinity ? `${size.width}px` : "auto";
    el.style.height = size.height != null && size.height != Infinity ? `${size.height}px` : "auto";
    try {
        return fn();
    }
    finally {
        el.style.position = position;
        el.style.display = display;
        el.style.width = width;
        el.style.height = height;
    }
}
export class StyleSheet {
    constructor(root) {
        this.root = root;
        this.known = new Set();
        this.style = style({ type: "text/css" });
        prepend(root, this.style);
    }
    append(css) {
        if (!this.known.has(css)) {
            this.style.appendChild(document.createTextNode(css));
            this.known.add(css);
        }
    }
}
StyleSheet.__name__ = "StyleSheet";
export const stylesheet = new StyleSheet(document.head);
//# sourceMappingURL=dom.js.map