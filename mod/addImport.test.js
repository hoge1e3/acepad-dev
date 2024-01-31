import {addImport,scanDecl} from "./addImport.js";
import {equal,ok} from "../assert.js";
//IMPORT END
export function test(){
    let home=getHome().rel("mod/test/");
    home.mkdir();
    home.rel("moved/").mkdir();
    function file(n,v){
        home.rel(n).text(v);
    }
    function fileq(n,v){
        equal(home.rel(n).text(),v);
    }
    
    file("a.js",`b();`);
    file("b.js",`export function b(){c();}`);
    ok(scanDecl(home.rel("b.js"),"b"),"bb");
    file("c.js",`
export function c(){alert(3);}`);
    addImport(home, 
        home.rel("b.js"),
        "c");
    addImport(home, 
        home.rel("a.js"),
        "b");
    fileq("a.js",`import {b} from './b.js';
b();`);
    fileq("b.js",`import {c} from './c.js';
export function b(){c();}`);
    fileq("c.js",`
export function c(){alert(3);}`);
    print("passed");
}
    