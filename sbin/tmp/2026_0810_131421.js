#!run

export async function main(){
  for await(let i of e(this,5)){
    this.echo(await i)
  }
  return ;
}
async function *e(s,n){
  for(let i=0;i<n;i++){
    await s.sleep(0.1);
    yield i;
  }
}