#!run

export async function main(){
  for(let i=1;i<10000;i++){
    if(isk(i))this.echo(i);
  }
  
}
function isk(k){
  const ka=[...(k+"")];
  const kasc=ka.sort().join("")-0;
  const kdesc=ka.sort().reverse().join("")-0;
  return (kdesc-kasc)===k;
}