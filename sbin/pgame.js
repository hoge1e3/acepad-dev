#!run
import {show} from "@acepad/widget";
import {sleep} from "@hoge1e3/timeout";

export function init(){
  const w=show();
  const cv=document.createElement("canvas");
  const W=256,H=192;
  const sta={
    closed:false,
    frame:0,
  };
  w.on("close",()=>{
    sta.closed=true;
  });
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
    if(typeof x==="object"){
      if(x.w)w=x.w;
      if(x.h)h=x.h;
      if(x.c)c(x.c);
      ctx.fillRect(x.x,x.y,w,h);
      return ;
    }
    ctx.fillRect(x,y,w,h);
  };
  const c=(o)=>ctx.fillStyle=o;
  const cls=()=>{
    c("black");
    r(0,0,256,192);
  };
  const u=()=>new Promise(s=>requestAnimationFrame(s));
  const abs=Math.abs.bind(Math);
  const rnd=(a,b)=>{
    if(typeof a!="number"){
      return Math.random();
    }
    if(typeof b!="number"){
      return Math.floor(rnd()*a);
    }
    return rnd(b-a+1)+a;
  };
  const rm=(a,e)=>{
    const i=a.indexOf(e);
    if(i<0)return ;
    return a.splice(i,1);
  };
  class Vec{
    constructor (x,y){
      this.x=x;this.y=y;
    }
    sub(o){
      return v(this.x-o.x,this.y-o.y);
    }
    get len(){
      return (this.x**2+this.y**2)**0.5;
    }
    wrt(to){
      to.x=this.x;
      to.y=this.y;
    }
  }
  const v=Object.assign((x,y)=>{
    if(typeof x==="object"){
      y=x.y;x=x.x;
    }
    return new Vec(x,y);
  },{
  });
  const dist=(a,b)=>v(a).sub(b).len;
  return {r,c,m,cls,u,cv,ctx,abs,dist,v,
  sta,W,H,rnd,rm,widget:w};
}
export async function main(){
  const {r,c,m,cls,u,cv,ctx,abs,W,H,rnd,rm,dist,sta}=init();
  const es=[];
  const pl={x:100,y:100,vx:0,vy:0,c:"red"};
  for(let i=0;!sta.closed;i++){
    cls();
    if(rnd(100)==0||es.length==0){
      console.log("es",es);
      es.push({x:rnd(256),y:0,c:"#f0f"});
    }
    for(let e of es){
      r(e);
      e.y+=1;
      if(e.y>192){
        rm(es,e);
      }
      if(dist(pl,e)<20){
        rm(es,e);
      }
    }
    c("cyan");
    r(m);
    //c("red");
    r(pl);
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