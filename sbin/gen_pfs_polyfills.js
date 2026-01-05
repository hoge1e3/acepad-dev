#!run
import * as fs from "fs";
import * as process from "process";
import * as os from "os";
import * as path from "path";
const polyfills="/idb/pnode-ws/petit-fs/polyfills";

export async function main(){
  await fs.promises.access(polyfills);
  this.cd(polyfills);
  for (let [name,obj] of [
    ["fs",fs],["process",process],
    ["os",os],["path",path]]) {
      gen.call(this, name, obj);
  }
  await this.gsync();
  return ;
}
function gen(n,o) {
  const f=this.resolve(`${n}.js`);
  f.text(`
import {${n}} from "petit-fs";
${Object.keys(o).map((k)=>
`export const ${k}=${n}.${k};`).
  join("\n")
}
`);
}