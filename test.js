import o from "observable";
import * as $ from "acepad-ajax";
import {file2data} from "acepad-store-file";
import {init,checkout} from "acepad-store";


export async function main(){
    const target = ()=>({
  message1: "hello",
  message2: "everyone",
});

const handler1 = {};

const proxy1 = new Proxy(target, handler1);
this.echo(typeof proxy1);
this.echo(target===proxy1);
return ;
    throw new Error("era2");
    let {locate}=this.get("acepad");
    for(let i=0;i<5;i++){
        locate(i,i);
        this.echo("hello");
        await this.sleep(0.1);
    }
}
export async function test(){
    let z=this.resolve("/ram/img.zip");
    await this.zip("/",z,{excludes:["/ram/"]});//,{excludes:["node_modules/"]});
    let d=file2data(z);
    console.log(d);
    let c=await checkout("backup-1234");
    c.commit(d);
    
    //await main();
    
    /*let f=sh.resolve("node_modules/");
    for(let e of f.listFiles()){
        if(e.ext()!==".js")continue;
        console.log(e.name());
        e.moveTo(f.rel("acepad/").rel(e.name()));
    }*/
    /*
    let v=o(3);    
    v((r)=>acepad.print("chg "+r));
    acepad.print("v="+v());
    v.set(57);*/
    //alert(3);
}
//alert(5);