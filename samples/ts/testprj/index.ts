#!run
/*
*.ts files are compiled
  automatically 

This file is compiled into
js/index.js
(only if no error)
Press F7 and open js/index.js
Then, F5 to run
*/
// Try change "5" to 5 
// and you CAN get error
let x:string="5";
import {bfunc} from "./lib/mylib.js";
const bar:number = 21;

function foo(d:HTMLElement):string {
    //Uncomment the next line :-)
    //d.getElementBy_oops_i_forgot("#test");
    return d.tagName;
}
export function main(this:any){
    this.echo(bfunc(bar));
    //this.echo(bfunc("This is type error"));
    this.echo("tag=",foo(document.body));
}