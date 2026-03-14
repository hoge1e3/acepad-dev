#!run

export async function main(){
  return this.resolve("/idb/run/node_modules/").getMetaInfo();
}