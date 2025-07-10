import {open} from "./browser.js";
import {FS,loadModule} from "@acepad/os";

export let h=FS.get(__dirname);
window.ld=async (path,method,...a)=>{
    let m=await loadModule(path);
    if(method){
        return m[method](...a);
    }
    return m;
};
open(h.rel("index.html")).then(
    (e)=>1,(e)=>alert(e));
