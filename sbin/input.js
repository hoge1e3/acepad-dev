#!run
import {showIframe} from "@acepad/widget";
export async function main(){
  const a=this.$acepad;
  
  showIframe(this.resolve("input.html"),{
    pNode:1,
    global:{
      //acepad:a,
    }
  });
  return ;
}