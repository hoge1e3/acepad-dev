#!run

export async function main(){
  const p=this.resolve("test.js").path();
  this.echo(revp(p));
  return ;
}
function revp(p){
  const pp=p.split("/");
  return pp.reverse().join("<");
}
function resrevp(sh,line){
  
  const pp=p.split("/");
  return pp.reverse().join("<");
  return sh.resolve(line,true);
}