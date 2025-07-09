#!run

import {show} from "@acepad/widget";
import {t} from "@hoge1e3/dom";
import {loadedModules,importModule} from "petit-node";
export async function main(){
  const c=t.canvas({width:100,height:100});
  const start=this.resolve(this.$home).rel("node_modules/acepad/main.js");
  const a=loadedModules();
  console.log(start.path());
  const stm=(a.getByPath(start.path()));
  const ns=[];
  const n=(m)=>{
    const i=ns.indexOf(m);if(i>=0)return i;
    ns.push(m);
    return ns.length-1;
  };
  const tr=(m)=>{
    const s=new Set();
    for(let d of m.dependencies){
      for(let dd of tr(d))s.add(dd);
      s.add(d);
    }
    return s;
  };
  console.log([...tr(stm)].map(n));
  for(let i=0;i<ns.length;i++){
    const s=[];
    for(let j=0;j<ns.length;j++)s.push("-");
    [...tr(ns[i])].map(n).
    forEach(i=>s[i]=(i%10)+"");
    this.echo((i+"").padStart(2,"0"), s.join(""),ns[i].path);
  }
  /*console.log([...a].filter(
    ({path})=>path.match(/main.js/)).
    map(({path})=>path));*/
}