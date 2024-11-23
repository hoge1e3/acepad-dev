import {sh} from "acepad-os-jsm";
import * as ace from "acepad-with-fs";
import {add as addLog} from "./logging.js";
import * as dotenv from "acepad-dotenv";
import {main as sug} from "acepad-suggest";
export async function main(){
    sh.cd(sh.resolve(import.meta.url).up());
    sh.$home=sh.cwd.path();
 
    dotenv.configUp(sh.resolve("./"));
    sh.set("path",sh.getenv("path")||"");
    //sh.addPath(sh.resolve("bin/").path());
    let acepad=await ace.main.call(sh);
    if(sh.hasCmd("filewatch")) sh.filewatch({addLog});
    sh["acepad-polyfiller.js"]();
    acepad.events.on("keyclick",({b})=>{
        if(acepad.getCurrentEditor().nolog)return ;
        addLog(sh,{text:b.innerText});
        //console.log("k",b.innerText);
    });
    sug.call(sh);
}
main().then((s)=>0,(e)=>alert(e.stack));