#!run
/*
Press F7 to go folder
and type
sh: tsc

Then open js/index.js and press F5
*/
import {bfunc} from "./lib/mylib.js";
const bar = 21;

function foo(d:HTMLElement):string {
    //Uncomment this and try tsc again :-)
    //d.getElementBy_oops_i_forgot("#test");
    return d.tagName;
}
export function main(this:any){
    this.echo(bfunc(bar));
    //this.echo(bfunc("This is type error"));
    this.echo("tag=",foo(document.body));
}