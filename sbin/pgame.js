#!run
import {show} from "@acepad/widget";
import {sleep} from "@hoge1e3/timeout";

export function init(){
  const w=show();
  const cv=document.createElement("canvas");
  const W=256,H=192;
  cv.setAttribute("width",256);
  cv.setAttribute("height",192);
  cv.setAttribute("style","width:512px;height:384px;");
  let m={x:128,y:96,p:false};
  w.element.appendChild(cv);
  cv.addEventListener("touchstart",(e)=>{
    const t=e.touches[0];
    m.x=t.clientX/2;
    m.y=t.clientY/2;
    m.p=true;
  });
  cv.addEventListener("touchmove",(e)=>{
    const t=e.touches[0];
    m.x=t.clientX/2;
    m.y=t.clientY/2;
  });
  cv.addEventListener("touchend",(e)=>{
    m.p=false;
  });
  const ctx=cv.getContext("2d");
  const r=(x,y,w=16,h=16)=>{
    ctx.fillRect(x,y,w,h);
  };
  const c=(o)=>ctx.fillStyle=o;
  const cls=()=>{
    c("black");
    r(0,0,256,192);
  };
  const u=()=>sleep(1000/60);
  const abs=Math.abs.bind(Math);
  return {r,c,m,cls,u,cv,ctx,abs,W,H};
}
export async function main(){
  const {r,c,m,cls,u,cv,ctx,abs,W,H}=init();
  const es=[];
  const pl={x:100,y:100,vx:0,vy:0};
  for(let i=0;;i++){
    cls();
    if(Math.random()<100){
      
    }
    c("cyan");
    r(m.x,m.y);
    c("red");
    r(pl.x,pl.y);
    pl.x+=pl.vx;
    pl.y+=pl.vy;
    pl.vx+=(m.x-pl.x)/100;
    pl.vy+=(m.y-pl.y)/100;
    if(pl.x<0)pl.vx=abs(pl.vx);
    if(pl.y<0)pl.vy=abs(pl.vy);
    if(pl.x>W)pl.vx=-abs(pl.vx);
    if(pl.y>H)pl.vy=-abs(pl.vy);
    await u();
  }
  //r(30,30);
  return ;
}