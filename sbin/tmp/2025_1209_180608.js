#!run
import * as fs from "fs";
export async function main(){
  fs.stat("/js/index.js",(e,r)=>{
    console.log(e,r);
  })
  return ;
}