#!run
import {x} from "./lib.js";
export async function main(){
  this.echo(x);
  await this.sleep(1);
  this.echo(x);
  
}