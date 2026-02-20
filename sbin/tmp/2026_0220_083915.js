#!run

export async function main(){
  return [[1,2],[9]].reduce(
    (a,b)=>[...a||[],...b],);
}