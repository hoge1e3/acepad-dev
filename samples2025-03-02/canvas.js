#!run
import {showWidget} from "@acepad/widget";
export async function main(){
    const c=document.createElement("canvas");
    c.setAttribute("width",500);
    c.setAttribute("height",500);
    const w=showWidget(c);
    const ctx=c.getContext("2d");
    for(let i=0;i<50;i++){
        ctx.fillRect(i*10,i*10,10,10);
        await this.sleep(0.1);
    }
    this.echo("(press F1 to switch this session).");
}
