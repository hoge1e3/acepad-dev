import {moveFile} from "refactor.js";
//IMPORT END
export function test(){
    let home=getHome().rel("mod/test/");
    home.mkdir();
    home.rel("moved/").mkdir();
    function file(n,v){
        home.rel(n).text(v);
    }
    function fileq(n,v){
        if(home.rel(n).text()===v)return ;
        throw new Error(`
[${home.rel(n).text()}]
!==
[${v}]`);
    }
    file("a.js",`import {b} from 'b.js';
b();`);
    file("b.js",`import {c} from 'c.js';
export function b(){c();}`);
    file("c.js",`
export function c(){alert(3);}`);
    moveFile(home,
        home.rel("b.js"),
        home.rel("moved/b.js"));
        

    fileq("a.js",`import {b} from './moved/b.js';
b();`);
    fileq("moved/b.js",`import {c} from '../c.js';
export function b(){c();}`);
    fileq("c.js",`
export function c(){alert(3);}`);
    print("passed");
}
    