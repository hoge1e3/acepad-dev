import {sh} from "@acepad/os-jsm";
import * as ace from "@acepad/with-fs";
import * as dotenv from "@acepad/dotenv";
import * as pNode from "petit-node";
import {installBootMenu} from "@acepad/installer";
//import {sessionInfo} from "@acepad/sessions";
export async function main(opt={}){
  sh.cd(sh.resolve(
    import.meta.url
  ).up());
  sh.$home=sh.getcwd().path();
  if (!sh.getcwd().path().startsWith("/tmp")){
    installBootMenu(sh,"home",sh.getcwd(),{call:["main"]});
  }
  dotenv.configUp(sh.resolve("./"));
  sh.set("path",sh.getenv("path")||"");
  Error.stackTraceLimit = 100;
  let acepad=await ace.main.call(sh);
  setTimeout(()=>
  console.log("pNode.version",pNode.version),1500);
  if(opt.cmd){
    sh.exec(opt.cmd);
  }
    //sh.try("wcart-menu");
}
/*if(!globalThis.pNodeBootLoader?.version){
  main().then((s)=>0,(e)=>alert(e.stack));
}*/
export function install(){
  main({install:true});
}
