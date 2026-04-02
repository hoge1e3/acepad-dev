#!runts

import "http://cdnjs.com/libraries/stacktrace.js";
//https://unpkg.com/source-map@0.7.4/dist/source-map.min.js";
//https://cdn.jsdelivr.net/npm/stacktrace-js@2.0.2/stacktrace.min.js";
declare const StackTrace:any;
import {SFile} from "@hoge1e3/sfile";
interface Shell{
  resolve(p:string):SFile;
  run:Function;
}
export async function main(
  this:Shell){
  const srcm:string=
  await this.run("../js/setsrcmap.js","../js/setsrcmap.js")
  const url=URL.createObjectURL(
   new Blob([srcm],{type:"text/javascript"}));
  const i=await import(url);
  try{
    await i.main.call(this,"foo")
  }catch(e){
    const  t=StackTrace.fromError(e);
    console.log(t)
  }
  //return this.resolve("foo").text();
}
