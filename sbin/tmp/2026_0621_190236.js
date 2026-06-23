#!run

export async function main(){
  /*
  return pNode.resolveEntry(
    "import",
    "tonyu2-compiler",
    this.resolve(
      "/idb/run/node_modules/"))
  */
  return pNode.resolveEntry(
    "import",
    "@hoge1e3/roma",
    this.resolve(
      "/idb/run/node_modules/"))
  return this.resolve(
    "/idb/run/node_modules/@hoge1e3/roma/package.json"
    ).text();
  
  return ;
}