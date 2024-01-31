import {getModifier,setModifier,renderModifierState} from './modifier.js';
import {getEditor} from './states.js';
export function unsetSel(editor){
    if(unsetSel.t)clearTimeout(unsetSel.t);
    unsetSel.t=setTimeout(function (){
        if(getModifier("select")&&!selMode(editor)){
            setModifier("select",0);
            renderModifierState();
        }
    },100);
}
export function checkEnterEditMode(editor){
    let selm=selMode(editor);
    if(selm&&!getModifier("edit")) {
        setModifier("edit",2);
        setModifier("select",2);
    }
}
export function selMode(editor){
    //const editor=getEditor();
    return editor.getSelectedText();
}

