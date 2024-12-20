#!run
import {initTypescript} from "https://unpkg.com/petit-ts/dist/index.js";
import {fs, path, process, require} from "https://unpkg.com/petit-fs/dist/index.js";
import {compileFile,compileProject} from "./compile.js";
import {PathUtil} from "@hoge1e3/fs";
// Mount RAM disk on /tmp/
fs.mountSync("/tmp/","ram");
// Expand typescript lib files to /tmp/ts/
const ts=initTypescript({fs, path, process, require});
export function main(){
    // Test file
    const prj=this.resolve(import.meta.url).sibling("testprj/");
    // Do compilation
    path.join=function (...paths/*:string[]*/) {
        if (paths.length==0) throw new Error(`empty paths`);
        let res=paths.shift()/* as string*/;
        while(paths.length) {
            res=PathUtil.rel(PathUtil.directorify(res),
                paths.shift()/* as string*/);
        }
        return res;
    },
    path.relative=(f,t)=>PathUtil.relPath(t,PathUtil.directorify(f));
    compileProject({ts,fs,path}, 
        prj.path());
    // Check output js file
    
    //this.echo(fs.readFileSync("tmp/out/test.js","utf-8"));
}