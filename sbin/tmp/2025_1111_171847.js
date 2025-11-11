#!run
import {resolveEntry, ESModuleCompiler} from "petit-node"
import {file} from "@acepad/here";
export async function main(){
  const path=file(import.meta.url);
  const ent=resolveEntry(path);
  const compiler=ESModuleCompiler.create();
  const compiled=await compiler.compile(ent);
  let u=compiled.url;
  return u;
}