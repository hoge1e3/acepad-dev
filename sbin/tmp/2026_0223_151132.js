#!run
import {sleep} from "@hoge1e3/timeout";

import {wrap} from "@acepad/splashscreen";
export async function main(){
  await work();
  const w=await this.worker(
    this.resolve(import.meta.url))
  return w.work();
}
export function work(){
  return wrap(async()=>{
    
 console.log("w",typeof importScripts)
    await sleep(1000);
    return 5;
  })();
  
}