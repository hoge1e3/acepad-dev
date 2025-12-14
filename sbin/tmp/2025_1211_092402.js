#!run

export async function main(){        
  for(let i=0;i<100;i+=7){
    this.echo(i,i.toString(8))
  }
  return ;
}