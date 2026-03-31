#!run
import * as fs from "fs"
export async function main(){
  const f=this.resolve(import.meta.url)
  if(!f)throw 0
  const w=await
    this.worker(f);
  w.watch("w",f.up().path())
  watch("b",f.up().path())
  return ;
}

export function watch(n,p){
  fs.watch(p,{},(...a)=>
  console.log(n,...a));
}