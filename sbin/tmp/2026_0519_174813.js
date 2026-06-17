#!run
import * as isp from "is-plain-object";
export async function main(){
  return isp.isPlainObject({});
}