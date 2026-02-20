#!run
import {proxy} from "@hoge1e3/rpc";
export async function main(){
  const w=await this.worker(
    this.resolve(
    import.meta.url));
  const c=new MessageChannel();
  c.port1.onmessage=(m)=>{
    this.echo(m.data);
  };
  return await w.chn(
    proxy.transfer(c.port2)
  );
}
export async function chn(c){
  //return 
  c.postMessage(88);
  return 7;
}