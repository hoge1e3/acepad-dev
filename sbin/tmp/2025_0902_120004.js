#!run
import {recents} from "@acepad/files";
export async function main(){
  const avail=new Set();
  for(let r of recents.list(this)){
    this.echo(r);
    while(r){
      avail.add(r);
      r=r.up();
    }
  }
  this.echo(...avail);
}