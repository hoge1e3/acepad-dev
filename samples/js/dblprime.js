#!run
export async function main(){
  let c=2;
  for(let p of primes()){
    await this.sleep(0.1);
    this.echo(p);
    if(!check(p))throw new Error(p+" is not prime");
    while(c<p){
      if(check(c))throw new Error(c+" is prime");
      this.echo("!",c);
      c++;
    }
    c=p+1;
  }
}
export function*primes(){
  const found=[2,3,5,7,11];
  yield*found;
  let idx=1;
  found[0]=1;//sentinel
  let p=found[found.length-1]+2;
  while(true){
    while(found[idx]**2<=p)idx++;
    //found[idx]>sqrt p
    let i=idx-1;
    for(;p%found[i];i--);
    if(i==0){
      yield p;
      found.push(p);
    }
    p+=2;
  }
}
//naively check whether p is a prime.
function check(p){
  for(let i=2;i<p;i++){
    if(p%i==0)return false;
  }
  return true;
}