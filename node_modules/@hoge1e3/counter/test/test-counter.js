import {Counter} from "../counter.js";
import * as assert from "assert";
export async function main(){
    let c=new Counter();
    for(let e of [1,2,2,8,2,2,6,3,1,2]){
        c.add(e);
    }
    assert.equal(c.get(2),5);
    assert.equal(c.get(1),2);
    assert.equal(c.get(6),1);
    assert.equal(c.get(8),1);
    assert.equal(c.get(42),0);
    let prevn=-1;
    for(let [e,n] of c.descend()){
        assert.equal(c.get(e), n);
        if (prevn>=0) {
            assert.ok(n<=prevn); 
        }
        prevn=n;
        console.log(e,n);
    }
    prevn=-1;
    for(let [e,n] of c.ascend()){
        assert.equal(c.get(e), n);
        if (prevn>=0) {
            assert.ok(n>=prevn); 
        }
        prevn=n;
        console.log(e,n);
    }
    console.log("Passed");
}    
main();