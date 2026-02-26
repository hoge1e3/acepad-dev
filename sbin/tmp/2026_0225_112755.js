#!run
import * as fs from "fs";
export async function main(){
  const f=this.resolve("/idb/run/node_modules/ace-local-commands/js/ace-local-commands.ts");
  const c=f.getContent();
  console.log(c);
  const u=fs.readFileSync(f.path());
  console.log(u, u instanceof Buffer);
  return c.hasNodeBuffer();
}