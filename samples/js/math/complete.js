#!run
import {locate,currentLine,feed} from "@acepad/cursor";
function isComplete(n){
  let m=Math.sqrt(n),s=1;
  for(let i=2;i<m;i++){
    if(n%i==0){
      s+=i+(n/i);
      if(s>n)return false;
    }
  }
  if(n%m==0)s+=m;
  return s==n; 
}
export async function main(){
  const acepad=this.$acepad;
  await this.echo("scan");
  const s=acepad.getCurrentEditor().session;
  await this.echo("Scanning complete number");
  for(let i=1;i<40000000;i++){
    if(isComplete(i)){
      locate(s,0,-1);
      feed(s,i+"");
    }
    if((i&8191)==0){
      locate(s,0,0);
      currentLine(s,`scanned up to ${i}`);
      await this.sleep(1/1000);
    }
  }
}