#!run

export async function main(){
  const w=await this.worker("wtest.js",{
    show:(a)=>console.log(a)
  });
  try {
  return await w.test(0);
  }catch(e){
    this.echo("Err",e.stack);
  }
}