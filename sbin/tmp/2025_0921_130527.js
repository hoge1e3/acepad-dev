#!run
import * as process from "node:process";
export async function main(){
  return process.chdir("/tmp");
}