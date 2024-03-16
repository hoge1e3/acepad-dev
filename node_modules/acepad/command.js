import {getEditor} from './states.js';
import {writeClipboard,readClipboard} from './clipboard.js';
import {unsetSel} from './editmode.js';
export function parseCommands(cmds, prefix="") {
    const res={};
    if(!cmds)return res;
    for (let k of Object.keys(cmds)) {
        let v=cmds[k];
        if (typeof v==="function") {
            v={name: prefix+k, bindKey:k, exec:v};
        } else {
            if (!v.name) v.name=prefix+k;
        }
        v.exec=v.exec.bind(this);
        res[k]=v;    
    }
    //hoge;
    //console.log(res);
    return res;
}
export function attachCommands(commands){
    const editor=getEditor();
    commands=parseCommands(commands);
    for (let k in commands) {
        //console.log("attachCommand",k,commands[k]);
        editor.commands.addCommand(commands[k]);
    }

}
export function detachCommands(commands){
    const editor=getEditor();
    commands=parseCommands(commands);
    for (let k in commands) {
        //console.log("detachCommand",k,commands[k]);
        editor.commands.removeCommand(commands[k].name);
    }
}

export function exec(c){
    const editor=getEditor();
    switch(c){
        case "cut":return cut();
        case "copy":return copy();
        case "paste":return paste();
        default:
        let t=editor.execCommand(c);
        return t;
    }
}

export async function cut(){
    const editor=getEditor();
    try{
        let t= editor.getSelectedText();
        await writeClipboard(t);
        editor.session.remove(
        editor.getSelectionRange());
        unsetSel(editor);
    }catch(e){
        alert(e);
    }
}
export async function copy(){
    const editor=getEditor();
    try{
        let t= editor.getSelectedText();
        await writeClipboard(t);
        editor.getSelection().clearSelection();
        unsetSel(editor);
    }catch(e){
        alert(e);
    }
}
export async function paste(){
    const editor=getEditor();
    try{
        let t=await readClipboard();
        editor.insert(t);
        unsetSel(editor);
    }catch(e){
        alert(e);
    }
}