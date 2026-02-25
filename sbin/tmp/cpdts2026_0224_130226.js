#!run

export async function main(){
  for(let f of this.resolve(".").recursive()){
    if(!f.endsWith(".d.ts"))continue;
    this.echo(f);
  }
  return ;
}