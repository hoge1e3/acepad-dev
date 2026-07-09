#!runts
import {katakanaToHiragana}
from "./index.js"
export function main(this:any){
  const s=this.resolve("index.ts").text();
  const h= katakanaToHiragana(s).
  replaceAll("かたかな","ひらがな").
  replaceAll("ろーま","ローマ").
  replaceAll("ぱたーん","パターン");
this.resolve("indexh.ts").text(h)
  
}
