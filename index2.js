import {sh} from "acepad-os-jsm";
import * as ace from "acepad-with-fs";
export async function main(){
    sh.cd(sh.resolve(import.meta.url).up());
    await initCmds(sh);
    ace.main.call(sh);
}
async function initCmds(sh){
    sh.addPath(sh.resolve("bin/").path());
}
main();