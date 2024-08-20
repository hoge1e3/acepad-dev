import FS from "@hoge1e3/fs-nw";
import $ from "./jqp.js"; 
async function r(){
    FS.os={};
    globalThis.FS=FS;
    for(let k in process.env){
        FS.setEnv(k,process.env[k]);
    }
    globalThis.$=$;
    const {sh}=await import("acepad-shell");
    const modn=process.argv[2];
    const mod=await import(modn);
    if(!mod.main){
        throw new Error(`module ${modn} does not export main`)
    }
    //console.log(sh);
    await mod.main.apply(sh,process.argv.slice(3));
}
r();