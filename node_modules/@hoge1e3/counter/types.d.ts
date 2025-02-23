import { DefaultMap } from "@hoge1e3/default-map";

declare module "@hoge1e3/counter" {
    export class Counter<E> extends DefaultMap<E,number> {
        constructor();
        add(e:E, by?:number):number;
        ascend():[E,number][];
        descend():[E,number][];
    }
}