#!run
import {showWidget} from "@acepad/widget";
import * as worker from "@acepad/worker";

export async function main(){
    const c=document.createElement("canvas");
    const w=400,h=400;
    
    c.setAttribute("width",w);
    c.setAttribute("height",h);
    c.style.width=w+"px";
    c.style.height=h+"px";
    
    const wi=showWidget(c);
    const ctx=c.getContext("2d");
    const wk=await worker.createProxy(
      this.resolve("mandel_worker.js"),
      {
        plot(y,v){
          for(let x=0;x<w;x++){
          ctx.fillStyle=v[x]>0.5?"green":"black";
          ctx.fillRect(x,y,1,1);
          }
        }
      });
    let sx=-1,sy=-1,dx=1,dy=1;
    wk.show(sx,sy,dx,dy,w,h);
    c.addEventListener("click", (e) => {
      // get clicked point pixel coordinate of canvas c
      const rect = c.getBoundingClientRect(); // get canvas position and size
      const x = e.clientX - rect.left;        // x coordinate relative to canvas
      const y = e.clientY - rect.top;         // y coordinate relative to canvas
      const ex=sx+(x/w)*(dx-sx);
      const ey=sy+(y/h)*(dy-sy);
      [sx,dx]=[ex-(dx-sx)/4,ex+(dx-sx)/4];
      [sy,dy]=[ey-(dy-sy)/4,ey+(dy-sy)/4];
      wk.show(sx,sy,dx,dy,w,h);
    });
}
