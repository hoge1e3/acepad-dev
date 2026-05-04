#!run

export async function main(){
  console.log(this.glob("*.js"));
  return ;
}