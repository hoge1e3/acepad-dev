#!run

export async function main(){
  //const r=await fetch("https://cdn.jsdelivr.net/npm/react@18.2.0/react-18.2.0.tgz");
  const r=await fetch("https://registry.npmjs.org/petit-node/-/petit-node-1.6.9.tgz");
  console.log(r);
  const j=new Uint8Array(await r.arrayBuffer());
  console.log(j);
  return j.length;
}