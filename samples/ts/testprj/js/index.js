#!run
/*
*.ts files are compiled
  automatically

This file is compiled into
js/index.js
(only if no error)
Press F7 and ser js/index.js
*/
// Try change "5" to 5 
// and you CAN get error
let x = "5";
import { bfunc } from "./lib/mylib.js";
const bar = 21;
function foo(d) {
    //Uncomment the next line :-)
    //d.getElementBy_oops_i_forgot("#test");
    return d.tagName;
}
export function main() {
    this.echo(bfunc(bar));
    //this.echo(bfunc("This is type error"));
    this.echo("tag=", foo(document.body));
}
//# sourceMappingURL=index.js.map