import {setConfig,getEditor} from './states.js';
import {exec} from './command.js';
import {changeSession} from './sessions.js';
import {unsetSel} from './editmode.js';
import {modifierStateToInt,setModifier,renderModifierState} from './modifier.js';
export function initConfig(){
    setConfig({
        commands:{
            "ctrl-w":(editor)=>editor.session.foldAll(),
            sessions:{bindKey:"ctrl-1",exec(){
                changeSession("*sessions*");
            }},
            quitEdit:{exec(editor){
                unsetSel(editor);
                editor.getSelection().clearSelection();
                setModifier("edit",0);
                renderModifierState();
            }},/*
            indent(editor){
                editor.onCommandKey({},
                modifierStateToInt({}), 
                9);
        
            },*/
            unindent(editor){
                //alert("unindent");
                editor.onCommandKey({},
                modifierStateToInt({shift:1}), 
                9);
            },
        },
        menus:{
            ses(){
                changeSession("*sessions*");
            },
            gutt(){
                const editor=getEditor();
                editor.renderer.setShowGutter(
                    !editor.renderer.getShowGutter());
            },
        },
        jshint:{
            maxerr:10000,
            esnext:false,
            esversion:9,
            undef:true,
        }
    });
}




