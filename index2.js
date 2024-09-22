import {sh} from "acepad-os-jsm";
import * as ace from "acepad-with-fs";
export async function main(){
    sh.cd(sh.resolve(import.meta.url).up());
    await ace.main.call(sh);
    if(sh.hasCmd("filewatch")) sh.filewatch();
}
main().then((s)=>0,(e)=>alert(e.stack));