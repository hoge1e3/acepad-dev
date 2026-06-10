
# Basic command application using shell object
See samples on https://www.npmjs.com/package/@acepad/shell

Examples in this folder: ./bin ./sbin
npm-related commands: node_modules/.bin

# Widgets application

See https://www.npmjs.com/package/@acepad/widget

~~~js
#!run
/* global $*/
import {showWidget} from "@acepad/widget";
const raf=()=>new Promise(requestAnimationFrame); 
export async function main(){
    let wid=showWidget("<canvas>");
    let cv=wid.element;
    let ctx=cv.getContext("2d");
    let w= $(cv).width();
    let h= $(cv).height();
    cv.setAttribute("width", w);
    cv.setAttribute("height", h);
    while(true){
        let y=h/2;
        for (let i=0;i<w;i++) {
            ctx.fillRect(i,y,1,1);
            y+=(Math.random()*h<y?1:-1);
        }
        await raf();
    }
}
~~~

~~~js
import {r} from "@hoge1e3/dom-ref";
import {ref} from "@hoge1e3/ref";
import * as assert from "assert";
export async function main(){
  return this.widget(wmain);
}    
function wmain({id:idgen,t}){
  /*
  `idgen` is a proxy object for generate id
  `idgen.name` -> "idOfThisWidget-name"
  `idgen()` -> new id begins with "idOfThisWidget-"

  `t` is tag(dom) generator.

  `r(refobj, render)` creates dom component rendered on every refobj changes. 
  */
  const Item=
  (count=0,id=idgen())=>
    ({
      count,id,
      inc:()=>Item(count+1,id)
    });
  const itemRef=()=>ref(Item());
  // item refs ref 
  const itemrsr=ref([itemRef()]);
  const b=(c,a)=>t.button(
    {onclick:a},c);
  return t.div(
    t.h1("test"),
    r(itemrsr,(itemrs)=>
      t.div({id:idgen["items"]},
      ...itemrs.map((itemr)=>
        r(itemr,(item)=>t.div(
          {id:idgen[item.id]},
          t.span(item.count),
          b("inc",()=>
            itemr.value=item.inc()),
          b("del",()=>
            itemrsr.value=itemrsr.value.filter(
              (e)=>e!==itemr)),
    ))))),
    b("add",()=>
      itemrsr.value=[
        ...itemrsr.value,
        itemRef()
      ])
  );
}
~~~