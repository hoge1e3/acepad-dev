#!run
import * as path from "path";
export async function main(){
  return path.normalize(this.resolve(".").path());
}