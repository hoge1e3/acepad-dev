import {getEditor} from './states.js';
export function scrollBy(by) {
    const editor=getEditor();
    editor.renderer.scrollToLine( editor.renderer.getScrollTopRow()+by);
}
export function getKeypadTopRow() {
    const editor=getEditor();
    let top=document.querySelector("#keypad").getBoundingClientRect().top;
    return editor.renderer.pixelToScreenCoordinates(0,top).row;
}
export function scrollToKeypadTop() {
    return ;
    const editor=getEditor();
    let r=getKeypadTopRow();
    if (!r) return;
    r--;
    let cr=editor.session.getSelection().getRange().start.row;
    //console.log(cr,r);
    if (cr>r) {
        scrollBy(cr-r);
    }
}