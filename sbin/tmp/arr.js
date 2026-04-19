#!run
//import {showObj} from "./obj.js"
import * as path from "path";
import pNode from "petit-node";

let showObj;
pNode.importModule(
  path.join(
  path.dirname(pNode.urlToPath(import.meta.url)),
  "./obj.js")).then(m=>
  showObj=m.showObj
  );

export async function main(){
  await this.sleep(1)
  console.log("config",showObj);
  return showObj;
}
export function showArr(){
  
}