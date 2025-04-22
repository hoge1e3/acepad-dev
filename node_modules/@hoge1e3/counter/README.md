
# @hoge1e3/counter

Count-up elements 

## Example
~~~js
import {Counter} from "@hoge1e3/counter";
import * as assert from "assert";
const c=new Counter();
// c is a Counter that counts numbers 
for(let e of [1,2,2,8,2,2,6,3,1,2]){
    c.add(e);
}
assert.equal(c.get(2),5);// 2 is added 5 times.
assert.equal(c.get(1),2);// 1 is added 2 times.
assert.equal(c.get(6),1);// 6 is added once.
assert.equal(c.get(8),1);// 8 is added once.
assert.equal(c.get(42),0);// 42 is never added.
// show the numbers and its counts(frequencies) in desdending order of the count.
for(let [e,n] of c.descend()){
    console.log(e,n);// [2, 5], [1, 6] ...(42 is not appear here)
}
// in ascending order
for(let [e,n] of c.ascend()){
    console.log(e,n);
}
~~~

## class Counter&lt;E&gt;
- add(e:E, by?:number=1):number;
   - add element `e` and increments count by `by`, default is 1
- ascend():[E,number][];
   - returns elements and its counts in asdending order of the count.
- descend():[E,number][];
   - returns elements and its counts in desdending order of the count.
