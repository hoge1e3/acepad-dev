#!run

export async function main(){
  return this.watch(
    ()=>new Date());
}