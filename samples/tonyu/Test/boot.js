#!run
import {Tonyu} from "tonyu2-runtime";
/*
globalThis.Tonyu=Tonyu;
import pNode from "petit-node";
pNode.importModule(
  "./js/concat.js",import.meta.url);
  */
import u from "./js/concat.js";
export async function main(){
//parent.
//return k.Actor;
Tonyu.onRuntimeError=(e)=>{
  console.log(e);
};
const m=new u.Main();
const t=Tonyu.thread(m);
t.handleEx=Tonyu.onRuntimeError
t.apply(m,"main");//,[])
t.on("terminate",(e)=>{
  console.log(e)
})
await t.steps()
await t.promise()
//console.log(m.main());
}
main();