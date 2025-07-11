import {KeyValueStore} from "./kvs.js";
export async function test(x){
    const k=new KeyValueStore("worktes");
    await k.init();
    
    const a=await k.get("a");
    await k.set("a",a-1);
    return x*a;
}