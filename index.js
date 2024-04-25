import {FS,loadModule} from "acepad-os";
import {open} from "acepad-browser";
import {trial,debugSession} from "acepad-debug";
import {sh} from "acepad-os-jsm";
import {initVConsole,showVConsole} from "show-vconsole";
/*global $*/
async function main(){
    alert(3);
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
//            console.log("k",b.innerText);
        });
    }) ; 
}
async function initCmds(){
    sh.addPath(sh.resolve("bin/").path());
}
main();