#!run
//import { Index, Document } from "https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.light.module.min.js";
import {dir} from "@acepad/here";
import {sleep} from "@hoge1e3/timeout";
import {t} from "@hoge1e3/dom";
import { Index, Document,IndexedDB } from "https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.2/dist/flexsearch.bundle.module.min.js";
//"https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.2/dist/flexsearch.compact.module.min.js";
function refInput(r,attr={}){
  const d=t("input",{...attr,value:r.value});
  d.addEventListener();
}
export async function main(){
  const d=this.resolve(this.$home);//dir(import.meta.url);
  // create a document index
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
  await index.mount(db);
  //await index.clear();
  await addAll(index,d);
  //this.echo(await index.contains(0));
  // add documents to the index
  /*await index.add({ 
      id:"/home/test.txt",
      timestamp:10001,
      content: "some test function "
  });*/
  let  r;/*=await index.search("test", { 
    index: "path" ,
    enrich:true,
  });
  console.log("r",r);*/
  console.log("search");
  const t=Date.now();
  r=await index.search("hoge1e3 ref", { 
    index: "content",
    //enrich:true,
    merge:true,
  });
  
  console.log("t",Date.now()-t);
  console.log("r2",r);
  //console.log("get",await index.get("/home/test.txt"));
  return;
}
async function addAll(index,d){
  for(let f of d.recursive({excludes(f){
    return f.name()===".sync/"||f.name()===".git/";
  }})){
    //console.log("add",f.path());
    await add(index,f);
  }
}
async function add(index,f){
  const doc=await index.get(f.path());
  if(doc&&doc.timestamp===f.lastUpdate())return ;
  console.log("upd",f.path(),doc);
    await sleep(1);
  await index[doc?"update":"add"]({
    id:f.path(),
    timestamp: f.lastUpdate(),
    content: f.text()
  });
}
function old(){
  // create a simple index which can store id-content-pairs
  const i2ndex = new Index({
    tokenize: "forward"
  });

  for(let f of d.listFiles()){
    if(f.isDir())continue;
    index.add(f.name(),f.text());
  }
  /*
  // some test data
  const data = [
    'cats abcd efgh ijkl mnop qrst uvwx cute',
    'cats abcd efgh ijkl mnop qrst cute',
    'cats abcd efgh ijkl dogs cute',
    'cats abcd efgh ijkl cute',
    'cats abcd efgh cute',
    'cats abcd cute',
    'cats cute'
  ];
  

  // add data to the index
  data.forEach((item, id) => {
    index.add(id, item);
  });*/
  const query="text()";
  // perform query
  const result = index.search({
    query,
    enrich:true,
    suggest: false
  });
  console.log(result);


  // display results
  result.forEach(i => {
    //console.log(data[i]);
    const c=d.rel(i).text();
    const idx=c.indexOf(query);
    if(idx<0)return;
    this.echo(i,c.substring(idx-10,idx+10));
  });


}