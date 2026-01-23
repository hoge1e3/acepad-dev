#!run
import {get,set} from "@hoge1e3/global";
export async function main(){
  set("c",get("c")+10)
  return get("c");
}