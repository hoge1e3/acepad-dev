#!run

export async function main(){
  setTimeout(()=>this.echo(4),0);
  const p = Promise.resolve();
  p.then(()=>this.echo(6));
  queueMicrotask(()=>this.echo(5));
  for(let i=0;i<1000;i++){
    await Promise.resolve().then(()=>
    this.echo(i+100)
    
    );
  }
  this.echo(3);
  return ;
}