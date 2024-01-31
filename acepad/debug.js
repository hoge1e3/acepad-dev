import {sh} from './shell.js';
import {createSession} from './sessions.js';
import {currentLine,goLineEnd,print} from './cursor.js';
import {getHome} from './states.js';
import {openFile} from './files.js';
export let dses;
export function debugSession(){
    sh.outUI={
        log(...a){
            dprint(...a);    
        }
    };
    dses=createSession({
        type:"debug",
        commands:{
            return(){
                onEnter({
                    line:currentLine()
                });
            },
        },
    });
    if (window.ace_language_tools) {
        let completers=[window.ace_language_tools.textCompleter];
        dses.setOptions({enableLiveAutocompletion:completers});
        //console.log("comp",completers);
    }
    function looksLikeShell(cmd) {
        let res;
        const home=getHome();
        //let head={var:1,let:1,const:1, function:1};
        cmd.replace(/^\s*(\w+)(\s.+)?$/,(_,c,a)=>{
            if(sh[c]){
                res=c+(a||"");
            }
        });
        if(res)return res;
        cmd.replace(/\[(.*)\]\$\s*(.*)/,(_,d,c)=>{
            sh.cd(home.rel(d));
            res=c;
        });
        return res;
    }
    async function onEnter(e){
        const editor=e.editor;
        goLineEnd();
        print("\n");
        let issh;
        try{
            addCommandHist(e.line);
            let r;
            issh=looksLikeShell(e.line);
            if (issh) {
                r=await sh.enterCommand(issh);   
            } else {
                r=await eval(e.line);
            }
            window.ans=r;
            print(r);
            console.log(r);
            print("\n");
        }catch(ex){
            let f=hasTrace(e.line);
            if(f){
                openFile(f.file);
                editor.gotoLine(f.row,f.column);
            }else{
                print(convertStack(ex)||ex);
                console.error(ex);
                print("\n");
            }
        }finally{
            if(issh){
                sh.prompt();
            }
        }
    }
    function cls(){
        dses.setValue("");
        hist();
    }
    sh.cls=cls;
    //dses.setMode("ace/mode/javascript");
    hist();
}
export var commandHist={};
try{
    commandHist=JSON.parse(
        localStorage.commandHist)||{};
}catch(e){
}
export function hist(){
    for(let k in commandHist){
        dprint(k+"\n");
    }
    for(let i=0;i<10;i++){
        dprint("\n");
    }
}
export function addCommandHist(c){
    commandHist[c]=new Date().getTime();
    let s=Object.values(commandHist).sort().reverse();
    let th=s[16]||0;
    for(let k in commandHist){
        if(commandHist[k]<th)delete commandHist[k];
    }
    localStorage.commandHist=
    JSON.stringify(commandHist);
}
export function hasTrace(line){
    let res;
    const home=getHome();
    line.replace(
        /\((.+):(\d+):(\d+)\)/,
        (_,f,r,c)=>{
            f=home.rel(f);
            if(!f.exists()){
                return ;
            }
            res={
                file:f,
                row:r-0,
                column:c-0,
            };
        });
    return res;
}
//hasTrace=trial(hasTrace);
export function dprint(...a){
    print(dses,...a);
}
export function trial(f){
    return function (...a){
        try{
           let r=f.apply(this,a); 
           if(r && typeof r.then==="function"){
               return r.then((r=>r),handle);
           }
           return r;
        }catch(e){
            handle(e);
        }
    };
    function handle(e){
            let s=convertStack(e);
            dprint(s);
    }
}

export let logorg=console.log;
export function showConsole(){
    const s=document.querySelector(".vc-switch");
    s.click();
}
if (window.VConsole) {
   var vConsole = new window.VConsole();
   const t=setInterval(()=>{
        const s=document.querySelector(".vc-switch");
        if (!s) return;
        s.setAttribute("style","display: none;");
        clearInterval(t);
   },10);
}
export function convertStack(e){
    var stack=e.stack||"";
    for(var k in urlmap){
        stack=stack.replaceAll(k,urlmap[k]);
    }
    return stack;
}
export function errorHandler(a,b,c,d,e){
    console.log("err",arguments);
    //window.alert("era"+e);
    var stack=e ? e.stack : "";
    if(b){
        stack+="\n"+[b,c,d].join(":");
    }
    for(var k of Object.keys(urlmap)){
        stack=stack.replaceAll(k,urlmap[k]);
    }
    window.alert(stack);
    var fall="https://bitarrow.eplang.jp/beta2204/fs/pub/06993a21/ebk_ace1228.html";
    if(window.confirm("safe mode?")){
        window.location.href=fall;
    }
}
window.onerror=errorHandler;
window.urlmap=window.urlmap||{};
export async function eval2(jsCodeString,name){
    const home=getHome();
    if(typeof jsCodeString.text==="function"){
        name=jsCodeString.name();
        jsCodeString=jsCodeString.text();
    }
    if(!name&&!jsCodeString.match(/\n/)){
        name=jsCodeString;
        let f=home.rel(name);
        if(f.exists()){
            jsCodeString=f.text();
            //jsCodeString.replace(/\/\/require (.*)/g);
        }
    }
    var blob = new window.Blob(
    [jsCodeString],
    { type: 'application/javascript' });
    var blobUrl = window.URL.
    createObjectURL(blob);
    urlmap[blobUrl]=name;    
    return await loadScriptTag(blobUrl);
    // URL.revokeObjectURL(blobUrl);
}
export function loadScriptTag(url){
    
    const script = document.createElement('script');
    script.src = url;

    return new Promise(
        function (resolve,reject){
            script.addEventListener("load",resolve);
            script.addEventListener("error",reject);
            document.head.appendChild(script);
    });
}
export var run=eval2;

export function selIDE(){
    let list=[
        "https://bitarrow.eplang.jp/beta2204/fs/pub/8561df99/ace.html",
        ];
}



