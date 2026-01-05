#!run
import {createProxy} from '@acepad/worker';
export async function main(){
  let w=this.resolve(
    "2025_1230_164132.js");
  let p=await createProxy(w);
  await p.main();
  return ;
}