#!run
import {locate,currentLine} from "@acepad/cursor";
export async function main(){
  const s=(this.$session);
  this.echo(" ");
  let c=0;
  for(let i=1;i<=9999;i++){
    locate(s,0,0);
    (i+"").replace(/5/g,
    ()=>c++);
    currentLine(s,`${i} ${c}`);
    if(c>=2000)break;
    await this.sleep(0.01);
  }
  return ;
}