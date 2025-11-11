#!run

export async function main(){
  const t=await this.bauth(null,{
    h:true,
    
  });
  t.addEventListener("login",
    (e)=>t.send("cd\nls\n"));
  t.addEventListener("receive",
    (e)=>this.echo(e.detail.text));
  return t;
}