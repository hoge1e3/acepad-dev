#!run
import * as fs from "fs";
async function readIfExists(path, options) {
  try {
    return await fs.promises.readFile(path, options);
  } catch (err) {
    //this.echo(err.message+"---"+err.code);
    if (err.code === "ENOENT") return null; // ← 想定内の正常パス
    throw err; // ← 想定外の異常
  }
}

export async function main(){
  this.echo(1,await readIfExists.call(this,"/idb/run/package.json",{encoding:"utf8"}));
  this.echo(2,await readIfExists.call(this,"/idb/run/package2.json",{encoding:"utf8"}));
  return ;
}