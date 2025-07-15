#!run
import {initTypescript} from "https://unpkg.com/petit-ts/dist/index.js";
import {fs, path, process, require} from "https://unpkg.com/petit-fs/dist/index.js";
import {compileFile,compileProject} from "./compile.js";
// Mount RAM disk on /tmp/
fs.mountSync("/tmp/","ram");
// Expand typescript lib files to /tmp/ts/
const ts=initTypescript({fs, path, process, require});
export function main(){
    // Test file
    const prj=this.resolve(import.meta.url).sibling("testprj/");
    // Do compilation
    compileFile({ts,fs,path}, 
        prj.rel("test.ts").path(),
        prj.rel("js/").path());
    // Check output js file
    
    //this.echo(fs.readFileSync("tmp/out/test.js","utf-8"));
}