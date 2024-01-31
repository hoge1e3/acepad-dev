import {getEditor} from './states.js';
import {onChangeSession,autoSync,createSessionList,changeSession} from './sessions.js';
import {createDirList} from './files.js';
import {debugSession} from './debug.js';
export function basicSessions(home){
    let editor=getEditor();
    editor.on("changeSession", onChangeSession);
    setInterval(autoSync,100);
    
    let s=createDirList(home);
    createSessionList();
    debugSession();
    changeSession(s);
}

