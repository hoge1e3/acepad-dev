#!run
/*
Write integers from 1  
in ascending order 
using the decimal system. 
When the digit '5' was written 
exactly 1000 times,
what integer was written 
(or was about to be written)?
*/
import {locate,currentLine} from "@acepad/cursor";
export async function main(){
  const s=(this.$session);
  await this.echo("n / ocurrence of digit 5");
  await this.echo(" ");
  let c=0;
  for(let i=1;i<=9999;i++){
    locate(s,0,1);
    (i+"").replace(/5/g,
    ()=>c++);
    currentLine(s,`${i} ${c}`);
    if(c>=1000)break;
    await this.sleep(0.01);
  }
  return ;
}