#!run

export async function main(){
  const base="/idb/pnode-ws";
  const webpack = pNode.require(
    "webpack",base);
  console.log(webpack);
}