#!run
//import { Index, Document } from "https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.light.module.min.js";
import {file,dir} from "@acepad/here";
import {sleep} from "@hoge1e3/timeout";
import {t} from "@hoge1e3/dom";
import {ref} from "@hoge1e3/ref";
import {show} from "@acepad/widget";
import {Sym_src,Sym_dst} from "@hoge1e3/dom-updater";
import css from "@acepad/css"; 
import {overlay} from "ace-overlay";
import { Index, Document,IndexedDB } from "https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.2/dist/flexsearch.bundle.module.min.js";
//"https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.2/dist/flexsearch.compact.module.min.js";
function refInput(r,attr={}){
  const id=attr.id;
  if(!id)throw new Error(" refInput requires id");
  //const id=attr.id||(Math.random()+"").replace(/\D/g,"");
  const d=t.input({
    ...attr,
    value:r.value,
    oninput(){
      r.value=this.value;
    }
  });
  if(!r[id]){
    r.on("change",()=>
    document.getElementById(id).value=r.value);
    r[id]=1;
  }
  return d;
}
export async function main(){
  const sh=this;
  const d=this.resolve(this.$home);//dir(import.meta.url);
  // create a document index
  css(dir(import.meta.url).rel("flex.css"));
  const index = new Document({
      document: {
        store:true,
          id: "id",
          index: [/*{
            field: "path",
            tokenize: "exact",
          },*/
          /*"timestamp",*/
          {
            field:"content",
            tokenize: "forward",
          }]
        ,
      }
  });
  const db = new IndexedDB("acepad-search");
  // mount and await before transfering data
  //await index.mount(db);
  const w=show({overlay:true,width:70});
  const q=ref("");
  let indexed;
  let searching;
  let  r=[];
  function refresh(r){
    let c=0;
    w.print(t.div({id:"flexfinder"},
      t.div(
        refInput(q,{id:"flexq",placeholder:"find"}),
      ),
      t.h1(q.value),
      t.div(indexed?"":"indexing "),
      t.div(searching?"searching ":""),
      ...r.map(s=>{
        const f=file(s.id);
        if(!f.exists())return [];
        if(f.isDir())return [];
        if(c>50)return [];
        
        const lines=highlight(f,q.value);
        if(lines.length==0)return [];
        c+=lines.length;
        return t.div(...lines);
      }),
    ));
  }
  function highlight(f, word) {
    const text=f.text();
    const lines = text.split('\n');
    const result = [];
    let ln=1;
    for (const line of lines) {
      if (line.includes(word)) {
        const parts = line.split(word);
        const children = [];
  
        for (let i = 0; i < parts.length; i++) {
          children.push(parts[i]);
          if (i < parts.length - 1) {
            children.push(t.span({ class: "highlight" }, word));
          }
        }
        const lln=ln;
        result.push(t.div({
          onclick(){
            sh.edit(f,{row:lln,nomin:1});
          }
        },t.span({
          class: "filename"
        },`${f.name()}:${lln}`),...children));
      }
      ln++;
    }
    return result;
  }
  q.on("change",async ()=>{
    try{
      if(q.value==="")return ;
      searching=true;
      refresh([]);
      await sleep(1);
      r=await index.search(q.value, { 
        index: "content",
        //enrich:true,
        merge:true,
      });
      searching=false;
      console.log("r2",r);
      refresh(r,true);
    }catch(e){
      console.error(e);
    }
  });

  refresh([]);
  setTimeout(()=>
  document.querySelector("#flexq").dispatchEvent(
    new Event("click")),100);
  ///uoverlay(document.querySelector("#flexq"));
  //await index.clear();
  await addAll(index,d);
  indexed=true;
  //refresh([]);
  return;
}
async function addAll(index,d){
  for(let f of d.recursive({excludes(f){
    return f.name()===".gsync/"||f.name()===".sync/"||f.name()===".git/";
  }})){
    //console.log("add",f.path());
    await add(index,f);
  }
}
async function add(index,f){
  const doc=await index.get(f.path());
  if(doc&&doc.timestamp===f.lastUpdate())return ;
  //console.log("upd",f.path(),doc);
    await sleep(1);
  await index[doc?"update":"add"]({
    id:f.path(),
    timestamp: f.lastUpdate(),
    content: f.text()
  });
}
