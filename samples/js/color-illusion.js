#!run
import {showWidget} from "@acepad/widget";
export async function main(){
    const c=document.createElement("canvas");
    c.setAttribute("width",300);
    c.setAttribute("height",300);
    c.style.width="300px";
    c.style.height="300px";
    
    const w=showWidget(c);
  const ctx = c.getContext("2d");
  ctx.globalAlpha = 0.5;
  ctx.fillStyle="red";
  const cir = (x, y, r = 50) => {
    // draw circle
    ctx.beginPath();           // 新しいパスを開始
    ctx.arc(x, y, r, 0, Math.PI * 2); // 円を描く
    //ctx.fillStyle = "red";     // 塗りの色（任意）
    ctx.fill();                // 塗りつぶす
  };
  cir(100,100);
  await this.sleep(1);
  ctx.fillStyle="blue";
  cir(70,150);
  await this.sleep(1);
  ctx.fillStyle="yellow";
  cir(130,150);
  await this.sleep(1);
  ctx.globalAlpha=0.335;
  ctx.fillStyle="blue";
  ctx.fillRect(0,0,200,300);
  await this.sleep(1);
  
  ctx.globalAlpha=1;
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

  for(let x=170;x<=300;x++){
    for(let y=140;y<175;y++){
      ctx.putImageData(d,x,y,);
    }
    await this.sleep(0.05);
  }
  //this.echo("(press F1 to switch this session).");*/
}
