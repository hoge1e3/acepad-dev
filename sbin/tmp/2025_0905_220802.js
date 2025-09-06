#!run
import {show} from "@acepad/widget";
export async function main(){
  const w=show();
  const cv=document.createElement("canvas");
  cv.setAttribute("width",256);
  cv.setAttribute("height",192);
  cv.setAttribute("style","width:512px;height:384px;");
  
  w.element.appendChild(cv);
  cv.addEventListener("touchstart",()=>{
    
  })
  const ctx=cv.getContext("2d");
  const r=(x,y,w=16,h=16)=>{
    ctx.fillRect(x,y,w,h);
  };
  const c=(o)=>ctx.fillStyle=o;
  const cls=()=>{
    c("black");
    r(0,0,256,192);
  };
  const u=()=>this.sleep(1/60);
  for(let i=0;i<256;i++){
    cls();
    c("cyan");
    r(i,50);
    await u();
  }
  //r(30,30);
  return ;
}