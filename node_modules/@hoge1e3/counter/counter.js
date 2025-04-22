// @hoge1e3/counter
import {DefaultMap} from "@hoge1e3/default-map";
export class Counter extends DefaultMap{
    constructor(){
        super(0);
    }
    add(k,by=1){
        const v=this.get(k)+by;
        this.set(k,v);
        return v;
    }
    ascend(){
        return [...this].
        sort(([v,a],[v2,b])=>a-b);
    }
    descend(){
        return [...this].
        sort(([v,a],[v2,b])=>b-a);
    }
}

