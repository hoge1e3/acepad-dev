#!run

export async function main(){
  return (await this.worker(
    this.resolve("./wtest.js"),
    {
      show:(...a)=>
      this.echo(...a)
    }
    )).test(82);
}