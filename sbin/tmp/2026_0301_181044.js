#!run

export async function main(){
  const a=[];
  const r=new WeakRef(a);
  console.log(r.deref())
  return ;
}