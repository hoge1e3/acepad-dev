#!run
import {isPlainObject} from "is-plain-object";
export async function main(){
  return isPlainObject({});
}