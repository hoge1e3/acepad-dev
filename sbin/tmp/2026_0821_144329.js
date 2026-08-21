#!run

export async function main(){
  const r=await this.echo("abc");
  console.log("r",r);
}