#!run
import * as fs from "fs";
export async function main(){
  return fs.existsSync(
    "/idb/pnode-ws/package.json");
}