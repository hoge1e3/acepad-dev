import {isMobile} from './platform.js';
import {setEditor,getConfig} from './states.js';
import {parseCommands} from './command.js';
import {initKeypad} from './keypad.js';
import {doClick} from './keyhandler.js';
export function initEditor(){
    const ace=window.ace;
    if (!document.querySelector("#editor")) return initEditor_tonyu();
    window.ace_language_tools=ace.require("ace/ext/language_tools");
    let editor = ace.edit("editor");
    editor.setOptions({
        enableLiveAutocompletion: true
    });
    editor.setFontSize(15);
    if(isMobile())editor.textInput.getElement().setAttribute("readonly",true);
    setEditor(editor);
    let {commands}=getConfig();
    commands=parseCommands(commands);
    for (let k in commands) {
        editor.commands.addCommand(commands[k]);
    }
    return editor;
}
export function initCore(){
    initEditor();
    initKeypad({pressHandler:doClick});
}

