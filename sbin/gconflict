#!run

export async function main(){
  const home=this.resolve(
    this.$home);
  const conf=home.rel(
      ".gsync-conflicts/");
  for(let f of conf.recursive()){
    const t=f.truncExt();
    const d=f.up().relPath(conf);
    const e=f.ext();
    const m=/(.*)(\([0-9a-f]+\))$/.
    exec(t);
    if(!m)continue;
    const b=home.rel(d).rel(m[1]+e);
    //this.echo(d,m[1],m[2],e);
    if(!b)continue;
    this.echo("diff","-merge",b,f)
  }
  return ;
}