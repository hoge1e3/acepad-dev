#!run
import {showWidget} from "@acepad/widget";
export async function main(){
    const c=document.createElement("canvas");
    c.setAttribute("width",300);
    c.setAttribute("height",300);
    c.style.width="300px";
    c.style.height="300px";
  const th = (x, t, w, a, b) => {
  /*
    x < t - w/2  → return a
    x > t + w/2  → return b
    between them → linearly change a to b
  */
  
  if (x < t - w / 2) return a;
  if (x > t + w / 2) return b;

  // linear interpolation between a and b
  const ratio = (x - (t - w / 2)) / w;
  return a + (b - a) * ratio;
};

    const w=showWidget(c);
  const ctx = c.getContext("2d");
    for(let i=0;i<15;i++){
      for(let j=0;j<15;j++){
        ctx.fillStyle=(i+j)%2?"#666":"#ccc";
        ctx.fillRect(j*20,i*20,20,20);
      }
    }
    for(let i=0;i<300;i++){
      for(let j=0;j<300;j++){
        const d=ctx.getImageData(j,i,1,1);
        const rr=((j-150)**2+(i-150)**2)**0.5;
        const r=th(rr,80,40,1.2,0.6);
        d.data[0]*=r;
        d.data[1]*=r;
        d.data[2]*=r;
        ctx.putImageData(d,j,i);
      }
      await this.sleep(0.01);
    }

  /*ctx.drawImage(c, 
  130,140,35,35,
  230,140,35,35
  );*/
  const d=ctx.getImageData(135,150,1,1);
  console.log(...d.data);
  ctx.globalAlpha=1;
  ctx.fillStyle="black";
  ctx.fillText([...d.data].join(", "),
  200,200);
for(let y=145;y<155;y++){
    
  for(let x=170;x<=260;x++){
      ctx.putImageData(d,x,y,);
    await this.sleep(0.05);
    }
  }
  //this.echo("(press F1 to switch this session).");*/
}
