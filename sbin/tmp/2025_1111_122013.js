#!run
import {file} from "@acepad/here";
import * as path from "path";
export async function main(){
  const p=file(import.meta.url).path();
  this.echo(revp(p));
  this.echo(resrevp(this, revp(p)));
  return ;
}
function revp(p){
  return `${path.basename(p)}\t${path.dirname(p)}`;
  const pp=p.split("/");
  return pp.reverse().join("<");
}
function resrevp(sh,line){
  try{
    return sh.resolve(line,true);
  }catch(e) {
    const [n,d]=line.split("\t");
    const np=path.join(d,n);
    return sh.resolve(np,true);
  }
}