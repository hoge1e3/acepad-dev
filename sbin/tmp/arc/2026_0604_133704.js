#!run

export async function main(){
  const a=this.resolve().async();
  console.log(a);
  return await a.ls();
}