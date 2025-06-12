#!run
import * as path from "path";

export async function main(){
  this.echo(typeof path.basename("/"));
//console.log((await this["acepad-curfile"]()).path());
}