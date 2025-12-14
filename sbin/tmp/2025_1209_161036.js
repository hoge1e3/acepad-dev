#!run
import hoge from "./hoge.cjs";

export async function main(){
  //const base="/idb/pnode-ws";
  /*const webpack = pNode.require(
    "webpack",base);*/
  for (let [p,v] of pNode.loadedModules().byPath) {
    if (p.match(/hoge.cjs/) ){
      loop(v,{});
    }
  } 
  function loop(v,vis) {
    if (!v.dependencyMap) return;
    for (let [k,m] of v.dependencyMap) {
      const p=m.path;
      console.log(p,m);
      if (vis[p]) {
        console.log("LOOP",p);
        continue;
      }
      vis[p]=1;
      loop(m, vis);
    }
  }
  //console.log(webpack);
}