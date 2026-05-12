#!run
import * as fs from "fs"
export async function main(){
  await fs.promises.access("/idb/run/5yt")
  return 6;
}