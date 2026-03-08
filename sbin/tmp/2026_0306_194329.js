#!run

export async function main(){
  return this.watch(
    ()=>Math.floor(
      performance.now()/1000));
}