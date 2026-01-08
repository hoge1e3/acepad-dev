#!run
import * as rpc from 
    "https://cdn.jsdelivr.net/npm/@hoge1e3/rpc@latest/dist/index.js";
import * as pnode from "petit-node";
export async function main(){
  //const pkg="http://localhost:3000/pnode-bootkit/gen/boot/index_v106.js";
  const pkg="http://localhost:3000/bootkit-pack/dist/index.js";
  const w=new Worker(pkg,
  {type:"module"});
  const id=Math.random()+"";
  const bootcli=rpc.proxy.client(w,"boot");
  await bootcli.boot({
    fstab: [
      {mountPoint:"/tmp", fsType:"ram", options:{}},
      {mountPoint:"/idb", fsType:"idb", options:{dbName: "petit-fs", storeName: "kvStore"}},
    ],
    main:this.resolve("./wtest.js").path(),
    id,// for reverse 
  });
  //this.echo("Workerstart");
  const cli=rpc.proxy.client(w,"default");
  return await cli.test(21);
}