import {locate,currentLine,print} from './cursor.js';
import {sessionInfo,createSession} from './sessions.js';
import {getEditor} from './states.js';
import {openFile} from './files.js';
/* global locate,sessionInfo,getEditor,openFile,currentLine */
export function     byts(a,b){
        return b.lastUpdate()-a.lastUpdate();
    }
export function        createFind(dir,w=""){
        const editor=getEditor();

        let session;
        //console.log("fnd",acepad);
        function top(){
            let s=editor.session.getSelection();
            s.moveCursorFileStart();
            s.clearSelection();
        }
        function bot(){
            let s=editor.session.getSelection();
            s.moveCursorFileEnd();
            s.clearSelection();
        }
        function onActivated(editor){
            //bot();
            locate(10000,0);
        }
        function runf(word,editor){
            //editor.setValue("find: "+word+"\n");
            locate(1000);
            sessionInfo(session,{
                name:"?"+word
            });
            print("\n");
            //bot();
            window.findWord=word;
            const files=[];
            const fil=(typeof word==="string"?
            (line)=>line.indexOf(word)>=0:
            (line)=>word.exec(line)
            );
            dir.recursive((f)=>files.push(f));
            for (let f of files.sort(byts)) {
                let ln=1;
                //editor.onTextInput("{");
                for(let line of f.lines()){
                    if(fil(line)){
                        print(
                            `${f.relPath(dir)}(${ln}): ${line}\n`
                            );
                    }
                    ln++;
                }
                //editor.onTextInput("}");
            }
            top();
        }
        //SYM
        delete window.findWord;
        session= createSession({
            type:"find",
            text:"find: "+w+
            "\nsymbol: "+w+
            "\nregex: "+w+"\n",
            name:"?"+w,
            onActivated,
            commands:{
                return(){
                    onEnter({
                        line:currentLine()
                    });
                }
            },
            //onEnter
        });
        return session;
        function onEnter(e){
            let line=
            e.line.replace(
                /^find: *(.*)/,
                (_,n)=>{
                    runf(n,editor);
                });
            e.line.replace(
                /^symbol: *(.*)/,
                (_,n)=>{
                    runf(new RegExp("\\b"+n+"\\b"),
                    editor);
                });
            e.line.replace(
                /^regex: *(.*)/,
                (_,n)=>{
                    runf(new RegExp(n),editor);
                });
            e.line.replace(
                /^(.*)\((\d+)\):/,
                (_,f,l)=>{
                    openFile(dir.rel(f));
                    editor.gotoLine(l,0);
                });
        }
    }
