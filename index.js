import {sh} from "@acepad/os-jsm";
import * as ace from "@acepad/with-fs";
import {add as addLog} from "./logging.js";
import * as dotenv from "@acepad/dotenv";
import {main as sug} from "@acepad/suggest";
import * as pNode from "petit-node";
import {installBootMenu} from "@acepad/installer";
export async function main(opt={}){
    sh.cd(sh.resolve(import.meta.url).up());
    sh.$home=sh.getcwd().path();
    installBootMenu(sh,"home",sh.getcwd());
    dotenv.configUp(sh.resolve("./"));
    sh.set("path",sh.getenv("path")||"");
    //const s=await submenu();
    //console.log("submenu",s);
    Error.stackTraceLimit = 100;
    let acepad=await ace.main.call(sh);
    if (process.env.ACEPAD_DEBUG) {
        if(sh.hasCmd("filewatch")) sh.filewatch({addLog});
    }
    if (process.env.ACEPAD_LOGGING) {
        acepad.events.on("keyclick",({b})=>{
            if(acepad.getCurrentEditor().nolog)return ;
            addLog(sh,{text:b.innerText});
        });
    }
    sug.call(sh);
    setTimeout(()=>
    console.log("pNode.version",pNode.version),1500);
    if(opt.cmd){
      sh.exec(opt.cmd);
    }
}
async function submenu(){
  const b=globalThis.pNodeBootLoader;
  if (!b) return;
  const s=b.getSelectedSubmenu();
  if (!s) return;
  return await s;
}
if(!globalThis.pNodeBootLoader?.version){
  main().then((s)=>0,(e)=>alert(e.stack));
}
export function install(){
  main({install:true});
}
export function test(x){
  alert(x);
}