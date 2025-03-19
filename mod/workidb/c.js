#!run
import * as worker from "@acepad/worker";
import * as assert from "assert";
import {wrap} from "@hoge1e3/splashscreen";
import pNode from "petit-node";
import {KeyValueStore} from "./kvs.js";
export async function main(){
    const e=pNode.resolveEntry(this.resolve("w.js"));
    const c=await wrap(
        worker.createProxy(e.file),
        "create worker"
    );
    console.log("c",c);
    const k=new KeyValueStore("worktes");
    await k.init();
    await k.set("a",100);
    this.echo(await c.test(21));
    this.echo(await k.get("a"));
    
}    
