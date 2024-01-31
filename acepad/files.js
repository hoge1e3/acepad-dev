import {getEditor,getHome} from './states.js';
import {sessionMap,sessionInfo,createSession} from './sessions.js';
import {events} from './events.js';
import {locate,print,currentLine} from './cursor.js';
import {sh} from './shell.js';

export function     openFile(fn){
    const editor=getEditor();
    const home=getHome();
        let f;
        if(typeof fn=="string"){
            f=home.rel(fn);
        }else{
            f=fn;
            fn=f.name();
        }
        let s=findSessionByFile(f);
        if(s){
            editor.setSession(s);
            return s;
        }
        if(f.isDir()){
            s=createDirList(f);
            editor.setSession(s);
            return ;
        }
        if(!f.exists())f.text("");
        s=ace.createEditSession(f.text());
        editor.setSession(s);
        if(f.ext()==".html"){
            s.setMode("ace/mode/html");
        }else if(f.ext()==".php"){
            s.setMode("ace/mode/php");
        }else if(f.ext()==".c"){
            s.setMode("ace/mode/c");
        }else if(f.ext()==".py"){
            s.setMode("ace/mode/python");
        }else if(f.ext()==".js"||f.ext()==".tonyu"){
            s.setMode("ace/mode/javascript");
        }
        sessionMap[fn]=s;
        sessionInfo(s,{
            file:f,
            type:"file",
            ts:f.lastUpdate(),
            val:s.getValue(),
        });
        events.fire("createSession",
        {name:fn,session:s});
        return s;
    }
export function     createDirList(dir){
        function onActivated(editor){
            editor.session.setValue(
            dir.listFiles().
            sort((a,b)=>
                b.lastUpdate()-
                a.lastUpdate()
            ).map((p)=>p.name())
            .join("\n")+"\nnew: "+
            "\nctrl-t: rename ctrl-e: remove");
        }
        let s=createSession({
            type:"files",
            file:dir,
            name:dir.name(),
            onActivated,
            commands:{
                "ctrl-e":function (){
                    locate(0,null);
                    print("rm: ");
                },
                "ctrl-t":function (){
                    locate(0,null);
                    print("mv: ");
                    locate(100,null);
                    print(" to: ");
                },
                return: onEnter
            },
        });
        function onEnter(e){
            let rm,mv;
            let f;
            let line=
            currentLine().replace(
                /^new: *(\S+)/,
                (_,n)=>{
                    let f=dir.rel(n);
                    if(!f.exists()) {
                        if (n.match(/\/$/)) {
                            f.mkdir();
                        } else {
                            f.text("");
                        }
                    }
                    return n;
                });
            line=line.replace(
                /^rm:? *(.+)/,
                (_,n)=>{
                    f=dir.rel(n);
                    rm=true;
                    return n;
                });
            line=line.replace(
                /^mv:? *(\S+) +to: +(\S+)/,
                (_,n,t)=>{
                    mv=dir.rel(t);
                    return n;
                });
            
            f=dir.rel(line);
            if(!f.exists()){
                alert("no "+f);
                return ;
            }
            if(rm){
                if(confirm("remove "+f.name()+"?")){
                    f.rm();
                    onActivated(editor);
                }
            }else if(mv){
                if(mv.exists()){
                    alert(`${mv.name()} exists`);
                }else{
                    f.moveTo(mv);
                    onActivated(editor);
                }
            }else{
                openFile(f);
            }
        }
        return s;
        //onActivated(editor);
        //handleOnEnter(si);
    }
export function     findSessionByFile(f){
        for(let n in sessionMap){
            let s=sessionInfo(sessionMap[n]);
            if(s.file&&
            s.file.path()===f.path()){
                return sessionMap[n];
            }
        }
    }
sh.edit=(a)=>openFile(sh.resolve(a));
