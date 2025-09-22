#!run
import {dir,file} from "@acepad/here";
import {require} from "petit-node";

export async function main(){
    const here=dir(
      import.meta.url);
    let ts;
    ts=require("typescript", here);
    console.log("ts",ts);
}