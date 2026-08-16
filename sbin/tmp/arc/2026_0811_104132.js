#!run
import {Tonyu} from "tonyu2-runtime";
import {showWidget} from "@acepad/widget";
import {t} from "@hoge1e3/dom";
import "/idb/run/samples/tonyu/Actest/js/concat.js";
const raf=()=>new Promise(requestAnimationFrame); 
export async function main(){
    let cv=t.canvas();
    let wid=showWidget(cv);
    Tonyu.globals.$mainCanvas=$(cv);
    globalThis.UIDiag={};
    Tonyu.run("kernel.Boot");
    return ;
}