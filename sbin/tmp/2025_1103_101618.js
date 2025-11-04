#!run

function a(x){
  console.log(x);
  return x;
}
export async function main(){
  const o={
    test(a,b){
      return a+b;
    }
  };
  o[a("test")](a(10),a(20));
  return ;
}