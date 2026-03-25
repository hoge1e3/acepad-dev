#!run
import {dir} from "@acepad/here"
const __dir=dir(import.meta.url);
export async function main(){
  setInterval(()=>{
    console.log(""+__dir.rel("a"));
    //
  },1000)
  return ;
  
}
