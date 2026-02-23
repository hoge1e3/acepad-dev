export async function test(x){
  if (x==0) x.a.b.c=5;
  await this.show("boo"+x);
  console.log(x*5);
  return x*2;
}