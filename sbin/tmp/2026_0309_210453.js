#!run

export async function main(){
  return (
    await this.jsm("myfile.js")).my();
}