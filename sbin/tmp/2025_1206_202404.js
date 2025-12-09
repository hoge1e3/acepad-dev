#!run

export async function main(){
  return {
    ...{x:2},
    ...{x:3},
    x:1,
    
  };
}