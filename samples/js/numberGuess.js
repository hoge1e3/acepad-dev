#!run

export async function main(){
  const a=Math.floor(
    Math.random()*100);
  for(let i=0;i<100;i++){
  const n=Number(await this.input());
    if(n==a)break;
    let bigger=n<a;
    // sometimes tells a lie.
    if(Math.random()<0.1)bigger=!bigger;
    this.echo("answer is",
    bigger?
      "bigger":"smaller","(maybe:-)");
  }
  return this.echo("You guessed",a);
}
