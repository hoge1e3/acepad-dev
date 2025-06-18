#!run
function *perm(s){
  if(s.length==1){
    yield s;return ;
  }
  for(let i=0;i<s.length;i++){
    const r=s.substring(0,i)+s.substring(i+1);
    for(let e of perm(r)){
      yield s[i]+e;
    }
  }
}
export async function main(){
  for(let e of perm(prompt("input your name"))){
    this.echo(e);
    await this.sleep(1/1000);
  }
}