#!run
import * as fs from "fs";
import * as pNode from "petit-node";
export async function main(){
  const trs=(s)=>s.replace(/\/$/,"");
  const df=pNode.
    getDeviceManager().
    df().map(d=>
    trs(d.mountPoint))
 // return df
  const f=this.resolve("/idb/pnode-ws");
  await fs.promises.readdir(f.path())
  for(let e of f.recursive({
    includeDir:true,
    excludes(f){
        return df.includes(trs(f.path()));
      },
      
  })){
    this.echo(e)
  }
  return ;
}