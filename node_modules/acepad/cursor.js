import {getEditor} from './states.js';
export function currentLine(session) {
    const editor=getEditor();
    session=session||editor.session;
    let r=session.getSelection().
    getRange().start.row;
    let line=session.doc.getLine(r);
    return line;
}
export function goTop(session){
    const editor=getEditor();
    session=session||editor.session;
    let s=session.getSelection();
    s.moveCursorFileStart();
    s.clearSelection();
}
export function goBottom(session){
    const editor=getEditor();
    session=session||editor.session;
    let s=session.getSelection();
    s.moveCursorFileEnd();
    s.clearSelection();
}
export function goLineEnd(session){
    const editor=getEditor();
    session=session||editor.session;
    let s=session.getSelection();
    s.moveCursorLineEnd();
    s.clearSelection();
}
export function print(...a){
    const editor=getEditor();
   let    session=editor.session;
    if(a[0] instanceof ace.EditSession)session=a.shift();
    session.insert(
        session.getSelection().
        getRange().start,
        a.join(" ")
    );
}
export function locate(...a){
    const editor=getEditor();
    let session=editor.session;
    if(a[0]&&a[0].insert)session=a.shift();
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
locate.get=function(session){
    const editor=getEditor();
    session=session||editor.session;
    let r=session.getSelection().
    getRange().start;
    return  r;
};