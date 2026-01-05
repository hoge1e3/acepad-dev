#!run
import * as fs from "fs";
const p="/idb/pnode-ws/bootkit-pack/test.txt";
import {createProxy} from "@acepad/worker";
export async function main(){
  const c=await createProxy(this.resolve(
    import.meta.url));
  c.work()
  return ;
}
export async function work(){
  let pc;
  setInterval(async()=>{
    let c=await fs.promises.readFile(p,"utf8");
    if(pc!=c){
      c+="\n"+c.length;
      pc=c;
      fs.promises.writeFile(p,c);
    }
      
  },2000);
}