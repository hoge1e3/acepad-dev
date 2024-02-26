import {FS,loadModule} from "acepad-os";
import {open} from "acepad-browser";
import {trial,debugSession} from "acepad-debug";
import {sh} from "acepad-shell";
import {showWidget} from "acepad-widget";
import {initVConsole,showVConsole} from "show-vconsole";
/*global $*/
async function main(){
    document.querySelector("#acepad-with-fs").onclick=trial(async ()=>{
        sh.cd(__dirname);
        await initCmds();
        (await sh.jsm("acepad-with-fs")).main.call(sh);
        
    });
    document.querySelector("#beta").onclick=trial(async ()=>{
        sh.cd("/jsmod/");
        await initCmds();
        
        let path=FS.get("/jsmod/node_modules/acepad/rest.js");
        let acepad=window.acepad=await 
        (await loadModule(path)).init();   
        sh.set("acepad",window.acepad);
        await sh.findword();
        let {openFile}=await loadModule("acepad-files",sh.cwd);
        openFile(sh,"./");
        debugSession(sh);
        acepad.attachCommands({
            "ctrl-r":()=>location.reload(),
            showDebug:{bindKey:"ctrl-d",exec(){
                acepad.changeSession("*debug*");
            }},
        });
        sh.resolve(".").recursive((f)=>{
            if(f.ext()!==".js")return ;
            let s=f.text();
            acepad.addToNgram(s);
        });
        initVConsole();
        acepad.showMenuButtons({
            cons(){
                showVConsole();
            }
        });
        acepad.events.on("keyclick",({b})=>{
            console.log("k",b.innerText);
        });
    }) ; 
    sh.upload=function (dst){
        return new Promise((s,err)=>{
            let w=showWidget($("<input>").attr({
                type:"file",
            }).on("input",oninput));
            async function oninput(e){
                w.close();
                try{
                    let b=await readFile(this.files[0]);
                    let f=this.value.split(/[\\\/]/);
                    f=f.pop();
                    console.log(b,f);
                    if(!dst){
                        dst=sh.resolve(f);
                    }else{
                        dst=sh.resolve(dst);
                    }
                    dst.setBytes(b);
                    s(dst);
                }catch(ex){
                    err(ex);
                }
            }
        });
    };
    function readFile(file) {
        return new Promise(function (succ) {
            var reader = new FileReader();
            reader.onload = function(e) {
                succ(reader.result);
            };
            reader.readAsArrayBuffer(file);
        });
    }

}
async function initCmds(){
    if (!FS.get("/ram/").exists()) FS.mount("/ram/","ram");
    sh.addCmd("jsm",async function (path,name,args=[]){
        let f=this.resolve(path);
        let mod;
        if(f.exists()){
            if(path.match&&!path.match(/^[\/\.]/)){
                console.warn(path,"should begin with / or ./");
            }
            mod=await loadModule(f);
        }else mod=await loadModule(path,this.cwd);
        if(name){
            const f=mod[name];
            if(!f)throw new Error(`${path} has no export ${name}`);
            return await f.apply(sh.clone(),args);
        }
        return mod;
    });
    sh.addCmd("testjs",function (f){
        return this.jsm(f,"test");
    });
    sh.addCmd("run",function (f,...args){
        return this.jsm(f,"main",args);
    });
    let {open}=await sh.jsm("./browser.js");
    sh.addCmd("page",open,"f");
    sh.addPath(sh.resolve("bin/").path());
    //await loadModule(sh.resolve("npm-init.js"));
    let a={
         async hoge(){}
    };
}
main();