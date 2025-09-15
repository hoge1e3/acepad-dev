#!run
import {showIframe} from "@acepad/widget";
export async function main(){
  showIframe(this.resolve("input.html"),{
    pNode:1
  });
  return ;
}