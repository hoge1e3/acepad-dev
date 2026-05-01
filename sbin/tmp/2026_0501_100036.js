#!run
import * as fs from "fs";
export async function main(){
  process.chdir(this.resolve(".").path());
  //await fs.promises.rm("linktest", { force: true });
  return fs.symlinkSync("../","linktest");
}