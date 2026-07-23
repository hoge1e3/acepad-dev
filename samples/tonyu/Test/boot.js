#!run
/*import {Tonyu} from "tonyu2-runtime";
globalThis.Tonyu=Tonyu;
import pNode from "petit-node";
pNode.importModule(
  "./js/concat.js",import.meta.url);
  */
import u from "./js/concat.js";
export async function main(){
//parent.
const m=new u.Main();
const t=Tonyu.thread(m);
t.apply(m,"main");//,[])
await t.steps()
await t.promise()
//console.log(m.main());
}