import {get,put,init,checkout} from "./hash.js"; 
import * as assert from "assert";
export async function test() {
    let val=Math.random();
    let id=await put({x:val});
    this.echo(id);
    let d1=await get(id);
    assert.equal(d1.x, val);
    this.echo(d1.x);
    
    let bn="test-2";
    /*let rep=await init(bn,{x:10});
    this.echo("init",JSON.stringify(rep));*/
    let rep=await checkout(bn);
    let comr=await rep.commit({x:20});
    this.echo("commit",JSON.stringify(comr));
    let cor=await checkout(bn);
    this.echo("cor",JSON.stringify(cor));
    assert.equal(cor.data.x,20);
    let cor2=await checkout(bn);
    this.echo("cor2",JSON.stringify(cor2));
    let cid=await cor.commit({x:50});
    try{
        await cor2.commit({x:60});
    }catch(e){
        this.echo("conf",JSON.stringify(e.response));
        
    }
}