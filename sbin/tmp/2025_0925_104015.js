#!run
import {get} from "asatte/siasatte.js";
export async function main(){
  return get(new Date);
}