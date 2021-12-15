// Based on https://github.com/phosphorjs/phosphor/blob/master/packages/signaling/src/index.ts
import { defer } from "./util/callback";
import { find, remove_by } from "./util/array";
export class Signal {
    constructor(sender, name) {
        this.sender = sender;
        this.name = name;
    }
    connect(slot, context = null) {
        if (!receiversForSender.has(this.sender)) {
            receiversForSender.set(this.sender, []);
        }
        const receivers = receiversForSender.get(this.sender);
        if (findConnection(receivers, this, slot, context) != null) {
            return false;
        }
        const receiver = context !== null && context !== void 0 ? context : slot;
        if (!sendersForReceiver.has(receiver)) {
            sendersForReceiver.set(receiver, []);
        }
        const senders = sendersForReceiver.get(receiver);
        const connection = { signal: this, slot, context };
        receivers.push(connection);
        senders.push(connection);
        return true;
    }
    disconnect(slot, context = null) {
        const receivers = receiversForSender.get(this.sender);
        if (receivers == null || receivers.length === 0) {
            return false;
        }
        const connection = findConnection(receivers, this, slot, context);
        if (connection == null) {
            return false;
        }
        const receiver = context !== null && context !== void 0 ? context : slot;
        const senders = sendersForReceiver.get(receiver);
        connection.signal = null;
        scheduleCleanup(receivers);
        scheduleCleanup(senders);
        return true;
    }
    emit(args) {
        var _a;
        const receivers = (_a = receiversForSender.get(this.sender)) !== null && _a !== void 0 ? _a : [];
        for (const { signal, slot, context } of receivers) {
            if (signal === this) {
                slot.call(context, args, this.sender);
            }
        }
    }
}
Signal.__name__ = "Signal";
export class Signal0 extends Signal {
    emit() {
        super.emit(undefined);
    }
}
Signal0.__name__ = "Signal0";
(function (Signal) {
    function disconnectBetween(sender, receiver) {
        const receivers = receiversForSender.get(sender);
        if (receivers == null || receivers.length === 0)
            return;
        const senders = sendersForReceiver.get(receiver);
        if (senders == null || senders.length === 0)
            return;
        for (const connection of senders) {
            if (connection.signal == null)
                return;
            if (connection.signal.sender === sender)
                connection.signal = null;
        }
        scheduleCleanup(receivers);
        scheduleCleanup(senders);
    }
    Signal.disconnectBetween = disconnectBetween;
    function disconnectSender(sender) {
        var _a;
        const receivers = receiversForSender.get(sender);
        if (receivers == null || receivers.length === 0)
            return;
        for (const connection of receivers) {
            if (connection.signal == null)
                return;
            const receiver = (_a = connection.context) !== null && _a !== void 0 ? _a : connection.slot;
            connection.signal = null;
            scheduleCleanup(sendersForReceiver.get(receiver));
        }
        scheduleCleanup(receivers);
    }
    Signal.disconnectSender = disconnectSender;
    function disconnectReceiver(receiver) {
        const senders = sendersForReceiver.get(receiver);
        if (senders == null || senders.length === 0)
            return;
        for (const connection of senders) {
            if (connection.signal == null)
                return;
            const sender = connection.signal.sender;
            connection.signal = null;
            scheduleCleanup(receiversForSender.get(sender));
        }
        scheduleCleanup(senders);
    }
    Signal.disconnectReceiver = disconnectReceiver;
    function disconnectAll(obj) {
        const receivers = receiversForSender.get(obj);
        if (receivers != null && receivers.length !== 0) {
            for (const connection of receivers) {
                connection.signal = null;
            }
            scheduleCleanup(receivers);
        }
        const senders = sendersForReceiver.get(obj);
        if (senders != null && senders.length !== 0) {
            for (const connection of senders) {
                connection.signal = null;
            }
            scheduleCleanup(senders);
        }
    }
    Signal.disconnectAll = disconnectAll;
})(Signal || (Signal = {}));
export function Signalable() {
    return class {
        connect(signal, slot) {
            return signal.connect(slot, this);
        }
        disconnect(signal, slot) {
            return signal.disconnect(slot, this);
        }
    };
}
const receiversForSender = new WeakMap();
const sendersForReceiver = new WeakMap();
function findConnection(conns, signal, slot, context) {
    return find(conns, conn => conn.signal === signal && conn.slot === slot && conn.context === context);
}
const dirty_set = new Set();
function scheduleCleanup(connections) {
    if (dirty_set.size === 0) {
        defer(cleanup_dirty_set);
    }
    dirty_set.add(connections);
}
function cleanup_dirty_set() {
    for (const connections of dirty_set) {
        remove_by(connections, (connection) => connection.signal == null);
    }
    dirty_set.clear();
}
//# sourceMappingURL=signaling.js.map