#!run
import {sleep} from "@hoge1e3/timeout";
import {createProxy} from "@acepad/worker";
import {file} from "@acepad/here";

export async function main(dir="."){
  const p=await createProxy(this.resolve(import.meta.url));
  return await p.c(this.resolve(dir).path());
}

export function c(h){
  const r=[...file(h).recursive()].length;
  close();
  return r;
}