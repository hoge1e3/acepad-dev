#!run

import {show} from "@acepad/widget";
import {t} from "@hoge1e3/dom";
export async function main(){
  const c=t.canvas({width:100,height:100});
  const state=this.resolve("/emoji.json");
  const so=state.exists()?state.obj():{until:0,found:""};
  show(c);
  const x=c.getContext("2d");
  const chkc=(d)=>{
    let hc=0;
    for(let i=0;i<d.length;i+=4){
      const a=(d[i]+d[i+1]+d[i+2])/3;
      const h=(d[i]-a)**2+(d[i+1]-a)**2+(d[i+2]-a)**2;
      hc+=h;
    }
    return hc;
  };
  const ise=(s)=>{
        x.clearRect(0,0,100,100);
    x.fillText(s,0,0);
    const p=x.getImageData(0,0,16,16);
    if (chkc(p.data)>10){
      so.found+=s;
      return true;
    }
  };
  x.fillStyle="black";
  x.font="16px monospace";
  x.textBaseline="top";
  const max=0x10FFFF+1;
  let i=so.until;
  while(true){
    const s=String.fromCodePoint(i);
    if(!so.found.includes(s)){
    if(ise(s)){
      let j=(i+max-1)%max;
      while(ise(String.fromCodePoint(j))){
        j=(j+max-1)%max;
        
      }
      j=(i+max+1)%max;
      while(ise(String.fromCodePoint(j))){
        j=(j+max+1)%max;
        
      }
      
    }
    
    }
    so.until=i;
    if(i%97==0)state.obj(so);
    i=(i+0x55555)%max;
    if(i==0)break;
    await this.sleep(0.001);
  }
  
}
const h="😅";
