#!run
import * as fs from "fs";
export async function main(){
  let c=0,p=this.resolve("test.css").path();
  fs.watchFile(p, 
  (...e)=>{
    console.log("Evt",c,...e);
    c++;
    if (c>2) fs.unwatchFile(p);
  });
  return fs.unwatchFile;
}