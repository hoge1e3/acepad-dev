#!run
import {createProxy,meta}
from "@acepad/worker";
export async function main(){
  const p=await createProxy(
    this.resolve(import.meta.url));
  this.echo(meta(p))
  return [...meta()];
}
export function t(){
  return 30;
}