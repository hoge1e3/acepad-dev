#!run

export async function main(){
  const s=`- fs
- os
- path
- process
- buffer
- assert
- util
- url
- querystring
- vm
- constants
- stream
- module`;
  
  for (let m of s.split("\n").map(s=>s.replace(/^- /,""))){
    const o=await pNode.importModule(m);
    this.echo(`- \`"${m}"\``);
    this.echo("   - "+Object.keys(o).map(k=>
    `${k}(${typeof o[k]})`).join(", "));
  }
}