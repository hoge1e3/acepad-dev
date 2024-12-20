#!run
import {canvas,rnd} from "acepad-canvas";
export async function main(){
    let {w,h,ctx,raf}=canvas();
    let a=[[0,50,0.1],[0,30,0.31415],
    [0,20,-0.8],
    [0,10,0.141413]];
    a=[];let s=1;
    for(let i=1;i<=25;i+=2){
        a.push([0,100/i,s*i*0.01]);
        s*=-1;
    }
    while(await raf()){
        let x=w/2;
        let y=h/2;
        ctx.fillStyle="white";
        //ctx.clearRect(0,0,w,h);
        ctx.strokeStyle="black";
        ctx.beginPath();
        ctx.moveTo(x,y);
        let rs=0;
        for(let e of a){
            let [r,l,v]=e;
            rs+=r;
            x+=Math.cos(rs)*l;
            y+=Math.sin(rs)*l;
            ctx.lineTo(x,y);
            e[0]+=v;
        }
        ctx.stroke();
    }
    this.echo("end");
}
