#!run
import pNode from "pnode:main";
import * as ss from "stacktrace-js";
export async function main(){
  const s=await pNode.importModule(
    "stacktrace-js","/");
  console.log(s);
  console.log(ss);
}