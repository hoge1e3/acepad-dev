#!run
import * as fs from "fs";
export async function main(){
  fs.watch("/idb/", { recursive: true }, (...a) => {
    console.log(...a);
  });
  //test
  return ;
}