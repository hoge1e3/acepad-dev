#!run

export async function main(){
  const m=new Map();
  m.set(6,8)
  m.set(65,38)
  
  return [...m];
}