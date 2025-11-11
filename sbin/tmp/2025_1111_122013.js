#!run
import {file} from "@acepad/here";
export async function main(){
  const p=file(import.meta.url).path();
  this.echo(revp(p));
  this.echo(resrevp(this, revp(p)));
  return ;
}
function revp(p){
  const pp=p.split("/");
  return pp.reverse().join("<");
}
function resrevp(sh,line){
  try{
    return sh.resolve(line,true);
  }catch(e) {
    const pp=line.split("<");
    const np=pp.reverse().join("/");
    return sh.resolve(np,true);
  }
}