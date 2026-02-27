#!run
import {sleep} from "@hoge1e3/timeout";
export async function main(){
  const w=await this.worker(
    this.resolve(import.meta.url)
    );
  const w2=(
    w.__unproxy__.target);
  setTimeout(()=>{
    w2.terminate()
  },3500)
  return await w.loop()
}
export async function loop(){
  let i=0;
  while(true){
    console.log(i++)
    await sleep(1000);
  }
  return "7"
}