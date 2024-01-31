import {getEditor} from './states.js';
import {getDatas,toggleSym} from './keypad.js';
import {checkEnterEditMode,selMode,unsetSel} from './editmode.js';
import {getModifier,clearUnlockedShifts,modifierButtonPressed,modifierStateToInt,currentModifierState} from './modifier.js';
import {exec} from './command.js';
import {scrollToKeypadTop} from './scroller.js';

export var followIdent={function:1,let:1,const:1,var:1,return:1,throw:1,new:1};
export function doClick(b) {
    const editor=getEditor();
    let d=getDatas(b);
    let cmd=d.command;
    let keyCode=d.keycode-0;
    let text=d.text;
    let mod=d.modifier;
    checkEnterEditMode(editor);
    //if (!cmd && !text && !mod && !keyCode) text=b.innerText;
    if (getModifier("ctrl") && d.ctrl) {
        exec(d.ctrl);
        clearUnlockedShifts();
        return;
    }
    if (cmd) {
        exec(cmd);
        clearUnlockedShifts();
        return;
    }
    if (mod) {
        modifierButtonPressed(d);
        return ;
    }
    const comp=editor.completer && editor.completer.activated && editor.completer; 
    let session=editor.session;
    if (keyCode===13) {
        if(!comp&&(
        editor.commands.commandKeyBinding.enter||
        editor.commands.commandKeyBinding.return 
        )){
            editor.onCommandKey(
            {},
            modifierStateToInt(),
            keyCode);
            return ;
        }
        if (comp) editor.onCommandKey(
            {},
            modifierStateToInt(),
            keyCode);
        else editor.onTextInput("\n");
    } else if (keyCode===9) {
        if (comp||selMode(editor)) editor.onCommandKey(
            {},
            modifierStateToInt(),
            keyCode);
        else editor.onTextInput("\t");
    } else if(isArrowKeyCode(keyCode)){
        let m=Object.assign({},currentModifierState());
        if(getModifier("select"))m.shift=2;
        editor.onCommandKey({},modifierStateToInt(m), keyCode);
    } else {
        if (text && !getModifier("ctrl")) {
            editor.onTextInput(text);
        } else {
            if (!keyCode) keyCode=text.toUpperCase().charCodeAt(0); 
            editor.onCommandKey({},modifierStateToInt(), keyCode);
        }
    }
    if (editor.completer) insertMatchHook(editor.completer);
    clearUnlockedShifts();
    scrollToKeypadTop();
    checkEnterEditMode(editor);
    unsetSel(editor);
}
export function isArrowKeyCode(keyCode) {
    return keyCode>=37&&keyCode<=40;
}
export function insertMatchHook(completer) {
    if (completer.insertMatch.hoge) return;
    let old=completer.insertMatch;
    const editor=getEditor();
    completer.insertMatch=function (...args) {
        let data=args[0]||this.popup.getData(this.popup.getRow());
        //console.log(data);
        let r=old.apply(this, args);
        //alert(r);
        if (data && !followIdent[data.value] ) {
            toggleSym();
        } else {
            editor.onTextInput(" ");
        }
        return r;
    };
    completer.insertMatch.hoge=true;
}
