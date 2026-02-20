export async function test(x){
  await this.show("boo"+x);
  return x*2;
}