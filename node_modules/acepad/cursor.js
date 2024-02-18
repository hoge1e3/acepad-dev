import {getEditor} from './states.js';
export function currentLine(...a) {
    const session=parseSession(a);
    let r=session.getSelection().
    getRange().start.row;
    let line=session.doc.getLine(r);
    return line;
}
export function goTop(...a){
    const session=parseSession(a);
    let s=session.getSelection();
    s.moveCursorFileStart();
    s.clearSelection();
}
export function goBottom(...a){
    const session=parseSession(a);
    let s=session.getSelection();
    s.moveCursorFileEnd();
    s.clearSelection();
}
export function goLineEnd(...a){
    const session=parseSession(a);
    let s=session.getSelection();
    s.moveCursorLineEnd();
    s.clearSelection();
}
function isSession(s){
    return s instanceof window.ace.EditSession;
}
function parseSession(a){
    const editor=getEditor();
    let session=editor.session;
    if(isSession(a[0]))session=a.shift();
    return session;
}
export function print(...a){
    const session=parseSession(a);
    session.insert(
        session.getSelection().
        getRange().start,
        a.join(" ")
    );
}
export function locate(...a){
    const session=parseSession(a);
    let [x,y]=a;
    let start={
        row: y, column:x
    };
    let d=locate.get(session);
    if(typeof start.row!="number"){
        start.row=d.row;
    }
    if(typeof start.column!="number"){
        start.column=d.column;
    }
    session.getSelection().
        setRange({
            start,end:start
        });
}
export function saveCursor(...a){
    const session=parseSession(a);
    let f=a.shift();
    let sv=locate.get(session);
    f();
    locate(session,sv.column,sv.row);
}
locate.get=function(...a){
    const session=parseSession(a);
    let r=session.getSelection().
    getRange().start;
    return  r;
};
locate.save=saveCursor;
locate.bottom=goBottom;
locate.lineEnd=goLineEnd;


