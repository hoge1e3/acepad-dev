#!run
import {computed,ref} from "@hoge1e3/ref";
export async function main(){
  let a=ref({})
  let b=ref(true);
  let c=computed(a,b,(...a)=>a)
  c.on("change",({val})=>{
    console.log(val)
  })
  await this.sleep(1);
  b.value=false;
  await this.sleep(1);
  b.value=true;
  return ;
}