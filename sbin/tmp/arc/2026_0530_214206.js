#!run

export async function main(){
  await this.cd("/idb/run/node_modules/@acepad/brg/src");
  this.runts("brg.ts");
  //return this.exec("cd /idb/run/node_modules/@acepad/brg/src;runts brg.ts ");
}