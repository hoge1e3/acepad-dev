import $ from "./jqp.js"; 
export async function main(){
    console.log(this.resolve("./").ls());
    const r=await $.get("https://edit.tonyu.jp/");
    console.log(r);
}