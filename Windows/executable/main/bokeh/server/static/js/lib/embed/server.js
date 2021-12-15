import { parse_token, pull_session } from "../client/connection";
import { logger } from "../core/logging";
import { add_document_standalone } from "./standalone";
// @internal
export function _get_ws_url(app_path, absolute_url) {
    let protocol = 'ws:';
    if (window.location.protocol == 'https:')
        protocol = 'wss:';
    let loc;
    if (absolute_url != null) {
        loc = document.createElement('a');
        loc.href = absolute_url;
    }
    else
        loc = window.location;
    if (app_path != null) {
        if (app_path == "/")
            app_path = "";
    }
    else
        app_path = loc.pathname.replace(/\/+$/, '');
    return protocol + '//' + loc.host + app_path + '/ws';
}
// map { websocket url to map { session id to promise of ClientSession } }
const _sessions = {};
function _get_session(websocket_url, token, args_string) {
    const session_id = parse_token(token).session_id;
    if (!(websocket_url in _sessions))
        _sessions[websocket_url] = {};
    const subsessions = _sessions[websocket_url];
    if (!(session_id in subsessions))
        subsessions[session_id] = pull_session(websocket_url, token, args_string);
    return subsessions[session_id];
}
// Fill element with the roots from token
export async function add_document_from_session(websocket_url, token, element, roots = [], use_for_title = false) {
    const args_string = window.location.search.substr(1);
    let session;
    try {
        session = await _get_session(websocket_url, token, args_string);
    }
    catch (error) {
        const session_id = parse_token(token).session_id;
        logger.error(`Failed to load Bokeh session ${session_id}: ${error}`);
        throw error;
    }
    return add_document_standalone(session.document, element, roots, use_for_title);
}
//# sourceMappingURL=server.js.map