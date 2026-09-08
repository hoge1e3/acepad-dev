#!run

export async function main(){
  return this.resolve(".").stat();
}