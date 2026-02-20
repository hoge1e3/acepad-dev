export async function test(x){
  await this.show("boo"+x);
  console.log(x*5)
  return x*2;
}