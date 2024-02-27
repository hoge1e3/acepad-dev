import {canvas,raf,rnd} from "acepad-canvas";
export async function main(){
    let {w,h,ctx}=canvas();
    let p=[0];
        
    for(let i=0;i<w-2;i++){
        p.push(rnd());
    }
    p.push(1);
    while(true){
        p=p.map((e,i)=>i==0?0:i==p.length-1?1:
        p[i-1]*(1-i/w)+p[i+1]*(i/w));    
        gr();
        await raf();
    }
    function gr(){
        ctx.clearRect(0,0,w,h);
        p.map((e,i)=>{
            ctx.fillRect(i,h-e*h,1,h);
        });
    }
}
