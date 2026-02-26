#!run

export async function main(){
  const sp=await pNode.importModule("@acepad/splashscreen",
  pNode.urlToPath(import.meta.url));
  sp.show("A");
  return ;
}