import Hammer from "hammerjs";
import { Signal } from "./signaling";
import { logger } from "./logging";
import { offset } from "./dom";
import * as events from "./bokeh_events";
import { getDeltaY } from "./util/wheel";
import { reversed, is_empty } from "./util/array";
import { isString } from "./util/types";
import { is_mobile } from "./util/compat";
import { ContextMenu } from "./util/menus";
function is_touch(event) {
    return typeof TouchEvent !== "undefined" && event instanceof TouchEvent;
}
export class UIEvents {
    constructor(plot_view, toolbar, hit_area) {
        this.plot_view = plot_view;
        this.toolbar = toolbar;
        this.hit_area = hit_area;
        this.pan_start = new Signal(this, 'pan:start');
        this.pan = new Signal(this, 'pan');
        this.pan_end = new Signal(this, 'pan:end');
        this.pinch_start = new Signal(this, 'pinch:start');
        this.pinch = new Signal(this, 'pinch');
        this.pinch_end = new Signal(this, 'pinch:end');
        this.rotate_start = new Signal(this, 'rotate:start');
        this.rotate = new Signal(this, 'rotate');
        this.rotate_end = new Signal(this, 'rotate:end');
        this.tap = new Signal(this, 'tap');
        this.doubletap = new Signal(this, 'doubletap');
        this.press = new Signal(this, 'press');
        this.pressup = new Signal(this, 'pressup');
        this.move_enter = new Signal(this, 'move:enter');
        this.move = new Signal(this, 'move');
        this.move_exit = new Signal(this, 'move:exit');
        this.scroll = new Signal(this, 'scroll');
        this.keydown = new Signal(this, 'keydown');
        this.keyup = new Signal(this, 'keyup');
        this.hammer = new Hammer(this.hit_area, {
            touchAction: 'auto',
            inputClass: Hammer.TouchMouseInput,
        });
        this._configure_hammerjs();
        // Mouse & keyboard events not handled through hammerjs
        // We can 'add and forget' these event listeners because this.hit_area is a DOM element
        // that will be thrown away when the view is removed
        this.hit_area.addEventListener("mousemove", (e) => this._mouse_move(e));
        this.hit_area.addEventListener("mouseenter", (e) => this._mouse_enter(e));
        this.hit_area.addEventListener("mouseleave", (e) => this._mouse_exit(e));
        this.hit_area.addEventListener("contextmenu", (e) => this._context_menu(e));
        this.hit_area.addEventListener("wheel", (e) => this._mouse_wheel(e));
        // But we MUST remove listeners registered on document or we'll leak memory: register
        // 'this' as the listener (it implements the event listener interface, i.e. handleEvent)
        // instead of an anonymous function so we can easily refer back to it for removing
        document.addEventListener("keydown", this);
        document.addEventListener("keyup", this);
        this.menu = new ContextMenu([], {
            prevent_hide: (event) => event.button == 2 && event.target == this.hit_area,
        });
        this.hit_area.appendChild(this.menu.el);
    }
    destroy() {
        this.menu.remove();
        this.hammer.destroy();
        document.removeEventListener("keydown", this);
        document.removeEventListener("keyup", this);
    }
    handleEvent(e) {
        if (e.type == "keydown")
            this._key_down(e);
        else if (e.type == "keyup")
            this._key_up(e);
    }
    _configure_hammerjs() {
        // This is to be able to distinguish double taps from single taps
        this.hammer.get('doubletap').recognizeWith('tap');
        this.hammer.get('tap').requireFailure('doubletap');
        this.hammer.get('doubletap').dropRequireFailure('tap');
        this.hammer.on('doubletap', (e) => this._doubletap(e));
        this.hammer.on('tap', (e) => this._tap(e));
        this.hammer.on('press', (e) => this._press(e));
        this.hammer.on('pressup', (e) => this._pressup(e));
        this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        this.hammer.on('panstart', (e) => this._pan_start(e));
        this.hammer.on('pan', (e) => this._pan(e));
        this.hammer.on('panend', (e) => this._pan_end(e));
        this.hammer.get('pinch').set({ enable: true });
        this.hammer.on('pinchstart', (e) => this._pinch_start(e));
        this.hammer.on('pinch', (e) => this._pinch(e));
        this.hammer.on('pinchend', (e) => this._pinch_end(e));
        this.hammer.get('rotate').set({ enable: true });
        this.hammer.on('rotatestart', (e) => this._rotate_start(e));
        this.hammer.on('rotate', (e) => this._rotate(e));
        this.hammer.on('rotateend', (e) => this._rotate_end(e));
    }
    register_tool(tool_view) {
        const et = tool_view.model.event_type;
        if (et != null) {
            if (isString(et))
                this._register_tool(tool_view, et);
            else {
                // Multi-tools should only registered shared events once
                et.forEach((e, index) => this._register_tool(tool_view, e, index < 1));
            }
        }
    }
    _register_tool(tool_view, et, shared = true) {
        const v = tool_view;
        const { id } = v.model;
        const conditionally = (fn) => (arg) => {
            if (arg.id == id)
                fn(arg.e);
        };
        const unconditionally = (fn) => (arg) => {
            fn(arg.e);
        };
        switch (et) {
            case "pan": {
                if (v._pan_start != null)
                    v.connect(this.pan_start, conditionally(v._pan_start.bind(v)));
                if (v._pan != null)
                    v.connect(this.pan, conditionally(v._pan.bind(v)));
                if (v._pan_end != null)
                    v.connect(this.pan_end, conditionally(v._pan_end.bind(v)));
                break;
            }
            case "pinch": {
                if (v._pinch_start != null)
                    v.connect(this.pinch_start, conditionally(v._pinch_start.bind(v)));
                if (v._pinch != null)
                    v.connect(this.pinch, conditionally(v._pinch.bind(v)));
                if (v._pinch_end != null)
                    v.connect(this.pinch_end, conditionally(v._pinch_end.bind(v)));
                break;
            }
            case "rotate": {
                if (v._rotate_start != null)
                    v.connect(this.rotate_start, conditionally(v._rotate_start.bind(v)));
                if (v._rotate != null)
                    v.connect(this.rotate, conditionally(v._rotate.bind(v)));
                if (v._rotate_end != null)
                    v.connect(this.rotate_end, conditionally(v._rotate_end.bind(v)));
                break;
            }
            case "move": {
                if (v._move_enter != null)
                    v.connect(this.move_enter, conditionally(v._move_enter.bind(v)));
                if (v._move != null)
                    v.connect(this.move, conditionally(v._move.bind(v)));
                if (v._move_exit != null)
                    v.connect(this.move_exit, conditionally(v._move_exit.bind(v)));
                break;
            }
            case "tap": {
                if (v._tap != null)
                    v.connect(this.tap, conditionally(v._tap.bind(v)));
                break;
            }
            case "press": {
                if (v._press != null)
                    v.connect(this.press, conditionally(v._press.bind(v)));
                if (v._pressup != null)
                    v.connect(this.pressup, conditionally(v._pressup.bind(v)));
                break;
            }
            case "scroll": {
                if (v._scroll != null)
                    v.connect(this.scroll, conditionally(v._scroll.bind(v)));
                break;
            }
            default:
                throw new Error(`unsupported event_type: ${et}`);
        }
        // Skip shared events if registering multi-tool
        if (!shared)
            return;
        if (v._doubletap != null)
            v.connect(this.doubletap, unconditionally(v._doubletap.bind(v)));
        if (v._keydown != null)
            v.connect(this.keydown, unconditionally(v._keydown.bind(v)));
        if (v._keyup != null)
            v.connect(this.keyup, unconditionally(v._keyup.bind(v)));
        // Dual touch hack part 1/2
        // This is a hack for laptops with touch screen who may be pinching or scrolling
        // in order to use the wheel zoom tool. If it's a touch screen the WheelZoomTool event
        // will be linked to pinch. But we also want to trigger in the case of a scroll.
        if (is_mobile && v._scroll != null && et == 'pinch') {
            logger.debug("Registering scroll on touch screen");
            v.connect(this.scroll, conditionally(v._scroll.bind(v)));
        }
    }
    _hit_test_renderers(sx, sy) {
        const views = this.plot_view.get_renderer_views();
        for (const view of reversed(views)) {
            const { level } = view.model;
            if ((level == 'annotation' || level == 'overlay') && view.interactive_hit != null) {
                if (view.interactive_hit(sx, sy))
                    return view;
            }
        }
        return null;
    }
    _hit_test_frame(sx, sy) {
        return this.plot_view.frame.bbox.contains(sx, sy);
    }
    _hit_test_canvas(sx, sy) {
        return this.plot_view.layout.bbox.contains(sx, sy);
    }
    _trigger(signal, e, srcEvent) {
        const gestures = this.toolbar.gestures;
        const event_type = signal.name;
        const base_type = event_type.split(":")[0];
        const view = this._hit_test_renderers(e.sx, e.sy);
        const on_canvas = this._hit_test_canvas(e.sx, e.sy);
        switch (base_type) {
            case "move": {
                const active_gesture = gestures[base_type].active;
                if (active_gesture != null)
                    this.trigger(signal, e, active_gesture.id);
                const active_inspectors = this.toolbar.inspectors.filter(t => t.active);
                let cursor = "default";
                // the event happened on a renderer
                if (view != null) {
                    cursor = view.cursor(e.sx, e.sy) || cursor;
                    if (!is_empty(active_inspectors)) {
                        // override event_type to cause inspectors to clear overlays
                        signal = this.move_exit; // XXX
                    }
                    // the event happened on the plot frame but off a renderer
                }
                else if (this._hit_test_frame(e.sx, e.sy)) {
                    if (!is_empty(active_inspectors)) {
                        cursor = "crosshair";
                    }
                }
                this.plot_view.set_cursor(cursor);
                this.plot_view.set_toolbar_visibility(on_canvas);
                active_inspectors.map((inspector) => this.trigger(signal, e, inspector.id));
                break;
            }
            case "tap": {
                const { target } = srcEvent;
                if (target != null && target != this.hit_area)
                    return; // don't trigger bokeh events
                if (view != null && view.on_hit != null)
                    view.on_hit(e.sx, e.sy);
                const active_gesture = gestures[base_type].active;
                if (active_gesture != null)
                    this.trigger(signal, e, active_gesture.id);
                break;
            }
            case "scroll": {
                // Dual touch hack part 2/2
                // This is a hack for laptops with touch screen who may be pinching or scrolling
                // in order to use the wheel zoom tool. If it's a touch screen the WheelZoomTool event
                // will be linked to pinch. But we also want to trigger in the case of a scroll.
                const base = is_mobile ? "pinch" : "scroll";
                const active_gesture = gestures[base].active;
                if (active_gesture != null) {
                    srcEvent.preventDefault();
                    srcEvent.stopPropagation();
                    this.trigger(signal, e, active_gesture.id);
                }
                break;
            }
            case "pan": {
                const active_gesture = gestures[base_type].active;
                if (active_gesture != null) {
                    srcEvent.preventDefault();
                    this.trigger(signal, e, active_gesture.id);
                }
                break;
            }
            default: {
                const active_gesture = gestures[base_type].active;
                if (active_gesture != null)
                    this.trigger(signal, e, active_gesture.id);
            }
        }
        this._trigger_bokeh_event(e);
    }
    trigger(signal, e, id = null) {
        signal.emit({ id, e });
    }
    _trigger_bokeh_event(e) {
        const ev = (() => {
            const { sx, sy } = e;
            const x = this.plot_view.frame.x_scale.invert(sx);
            const y = this.plot_view.frame.y_scale.invert(sy);
            switch (e.type) {
                case "wheel":
                    return new events.MouseWheel(sx, sy, x, y, e.delta);
                case "mousemove":
                    return new events.MouseMove(sx, sy, x, y);
                case "mouseenter":
                    return new events.MouseEnter(sx, sy, x, y);
                case "mouseleave":
                    return new events.MouseLeave(sx, sy, x, y);
                case "tap":
                    return new events.Tap(sx, sy, x, y);
                case "doubletap":
                    return new events.DoubleTap(sx, sy, x, y);
                case "press":
                    return new events.Press(sx, sy, x, y);
                case "pressup":
                    return new events.PressUp(sx, sy, x, y);
                case "pan":
                    return new events.Pan(sx, sy, x, y, e.deltaX, e.deltaY);
                case "panstart":
                    return new events.PanStart(sx, sy, x, y);
                case "panend":
                    return new events.PanEnd(sx, sy, x, y);
                case "pinch":
                    return new events.Pinch(sx, sy, x, y, e.scale);
                case "pinchstart":
                    return new events.PinchStart(sx, sy, x, y);
                case "pinchend":
                    return new events.PinchEnd(sx, sy, x, y);
                case "rotate":
                    return new events.Rotate(sx, sy, x, y, e.rotation);
                case "rotatestart":
                    return new events.RotateStart(sx, sy, x, y);
                case "rotateend":
                    return new events.RotateEnd(sx, sy, x, y);
                default:
                    return undefined;
            }
        })();
        if (ev != null)
            this.plot_view.model.trigger_event(ev);
    }
    _get_sxy(event) {
        const { pageX, pageY } = is_touch(event) ? (event.touches.length != 0 ? event.touches : event.changedTouches)[0] : event;
        const { left, top } = offset(this.hit_area);
        return {
            sx: pageX - left,
            sy: pageY - top,
        };
    }
    _pan_event(e) {
        return Object.assign(Object.assign({ type: e.type }, this._get_sxy(e.srcEvent)), { deltaX: e.deltaX, deltaY: e.deltaY, shiftKey: e.srcEvent.shiftKey, ctrlKey: e.srcEvent.ctrlKey });
    }
    _pinch_event(e) {
        return Object.assign(Object.assign({ type: e.type }, this._get_sxy(e.srcEvent)), { scale: e.scale, shiftKey: e.srcEvent.shiftKey, ctrlKey: e.srcEvent.ctrlKey });
    }
    _rotate_event(e) {
        return Object.assign(Object.assign({ type: e.type }, this._get_sxy(e.srcEvent)), { rotation: e.rotation, shiftKey: e.srcEvent.shiftKey, ctrlKey: e.srcEvent.ctrlKey });
    }
    _tap_event(e) {
        return Object.assign(Object.assign({ type: e.type }, this._get_sxy(e.srcEvent)), { shiftKey: e.srcEvent.shiftKey, ctrlKey: e.srcEvent.ctrlKey });
    }
    _move_event(e) {
        return Object.assign(Object.assign({ type: e.type }, this._get_sxy(e)), { shiftKey: e.shiftKey, ctrlKey: e.ctrlKey });
    }
    _scroll_event(e) {
        return Object.assign(Object.assign({ type: e.type }, this._get_sxy(e)), { delta: getDeltaY(e), shiftKey: e.shiftKey, ctrlKey: e.ctrlKey });
    }
    _key_event(e) {
        return {
            type: e.type,
            keyCode: e.keyCode,
        };
    }
    _pan_start(e) {
        const ev = this._pan_event(e);
        // back out delta to get original center point
        ev.sx -= e.deltaX;
        ev.sy -= e.deltaY;
        this._trigger(this.pan_start, ev, e.srcEvent);
    }
    _pan(e) {
        this._trigger(this.pan, this._pan_event(e), e.srcEvent);
    }
    _pan_end(e) {
        this._trigger(this.pan_end, this._pan_event(e), e.srcEvent);
    }
    _pinch_start(e) {
        this._trigger(this.pinch_start, this._pinch_event(e), e.srcEvent);
    }
    _pinch(e) {
        this._trigger(this.pinch, this._pinch_event(e), e.srcEvent);
    }
    _pinch_end(e) {
        this._trigger(this.pinch_end, this._pinch_event(e), e.srcEvent);
    }
    _rotate_start(e) {
        this._trigger(this.rotate_start, this._rotate_event(e), e.srcEvent);
    }
    _rotate(e) {
        this._trigger(this.rotate, this._rotate_event(e), e.srcEvent);
    }
    _rotate_end(e) {
        this._trigger(this.rotate_end, this._rotate_event(e), e.srcEvent);
    }
    _tap(e) {
        this._trigger(this.tap, this._tap_event(e), e.srcEvent);
    }
    _doubletap(e) {
        // NOTE: doubletap event triggered unconditionally
        const ev = this._tap_event(e);
        this._trigger_bokeh_event(ev);
        this.trigger(this.doubletap, ev);
    }
    _press(e) {
        this._trigger(this.press, this._tap_event(e), e.srcEvent);
    }
    _pressup(e) {
        this._trigger(this.pressup, this._tap_event(e), e.srcEvent);
    }
    _mouse_enter(e) {
        this._trigger(this.move_enter, this._move_event(e), e);
    }
    _mouse_move(e) {
        this._trigger(this.move, this._move_event(e), e);
    }
    _mouse_exit(e) {
        this._trigger(this.move_exit, this._move_event(e), e);
    }
    _mouse_wheel(e) {
        this._trigger(this.scroll, this._scroll_event(e), e);
    }
    _context_menu(e) {
        if (!this.menu.is_open && this.menu.can_open) {
            e.preventDefault();
        }
        const { sx, sy } = this._get_sxy(e);
        this.menu.toggle({ left: sx, top: sy });
    }
    _key_down(e) {
        // NOTE: keyup event triggered unconditionally
        this.trigger(this.keydown, this._key_event(e));
    }
    _key_up(e) {
        // NOTE: keyup event triggered unconditionally
        this.trigger(this.keyup, this._key_event(e));
    }
}
UIEvents.__name__ = "UIEvents";
//# sourceMappingURL=ui_events.js.map