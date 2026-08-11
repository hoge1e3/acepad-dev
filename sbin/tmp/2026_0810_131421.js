#!run

export async function main(){
  return ;
}
async *function e(s,n){
  for(let i=0;i<n;i++){
    await s.sleep(n);
    yield i;
  }
}