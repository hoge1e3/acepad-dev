#!run
import {file} from "@acepad/here";

import * as pNode from "petit-node";
//import {test}  from "./test.cjs";
export async function main(dst="built.js"){
  dst=this.resolve(dst);
  const home=this.resolve(".");
  const mp=home.rel("package.json").obj().main;
  const target=home.rel(mp).path();
  return build(target,dst);
}
export async function build(target,dst){
  try{
  const a=pNode.loadedModules();
  let mod=await compile(target);
  }catch(e){
    console.error(e.original)
  }
  console.log("pn",a.getByPath("petit-node"));
  if (!mod) {
    throw new Error(`module for ${target} not found`);
  }
  let mods=[];
  let m2id=new WeakMap();
  //id=number
  function getId(mod) {
    if(m2id.has(mod))return m2id.get(mod);
    for (const d of mod.dependencies) {
      getId(d);
    }
    m2id.set(mod,mods.length);
    mods.push(mod);
  }
  getId(mod);
  const Re="cheediwh"+"sifeudi";
  const Di="jejf"+"ksjfi";
  let buf="";
  const q=(d)=>JSON.stringify(d);
  const idc=(m)=>`/*${getId(m)}*/`;
  for(let m of mods){
    if(m.type==="Builtin"){
      buf+=`${idc(m)}b(${q(m.path)});\n`;
    }else{
      let rep=m.generatedCode;
      for(let d of m.dependencies){
        rep=replaceAll(rep,d.url,
          Re+Di+m2id.get(d)+Re);
      }
      /*rep=rep.replace(/\bimport\s*\.\s*meta\s*\.\s*url\b/g,
      q(m.path));*/
      const sa=rep.split(Re).map((s)=>
        s.startsWith(Di)?
          s.substring(Di.length)-0:s);
      const ts=file(m.path).lastUpdate();
      buf+=`${idc(m)}es(${q(m.path)},${ts},${q(sa)});\n`;
      console.log(m2id.get(m),m.path, sa);
    }
    //console.log(m2id.get(m),m);
  }
  dst.text(
    replaceAll((tmpl+""),
    "//insert",buf)+
    "tmpl();"
  );
}
function tmpl(){
//----
const pNode=globalThis.pNode;
let ld=[];
let aliases=pNode.loadedModules();
function es(path,timestamp,a){
  const dependencies=[];
  const dep=(s)=>{
    dependencies.push(ld[s]);
    return ld[s].url;
  };
  const g=a.map((s)=>
    typeof s==="string"?s:dep(s)
  ).join("");
  ld.push(pNode.addPrecompiledESModule(path, timestamp, g, dependencies));
}
function b(path){
  ld.push(aliases.getByPath(path));
}
//insert
import(ld.pop().url);
//----
}
function replaceAll(s,f, t) {  
  let result = '';
  let i = 0;
  while (true) {
    const j = s.indexOf(f, i);
    if (j === -1) {
      result += s.slice(i);
      break;
    }
    result += s.slice(i, j) + t;
    i = j + f.length;
  }
  return result;
}
async function compile(path) {
  const ent=pNode.resolveEntry(path);
  const compiler=pNode.ESModuleCompiler.create();
  const compiled=await compiler.compile(ent);
  //let u=compiled.url;
  return compiled;
}