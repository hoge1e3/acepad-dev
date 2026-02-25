#!run

export async function main(){
  const prj=this.resolve("/tmp/ace-master");
  const dst=this.resolve(this.$home).rel("node_modules/@hoge1e3/ace-types/");
  dst.mkdir();
  for(let f of prj.recursive()){
    if(!f.endsWith(".d.ts"))continue;
    this.cp(f,dst.rel(f.relPath(prj)));
  }
  return ;
}