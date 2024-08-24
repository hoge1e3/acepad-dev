import {sh} from "acepad-os-jsm";
import * as ace from "acepad-with-fs";
export async function main(){
    sh.cd(sh.resolve(import.meta.url).up());
    ace.main.call(sh);
}
main().then((s)=>0,(e)=>console.error(e.stack));