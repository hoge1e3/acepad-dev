#!run
import {init} from "@acepad/pgame";

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