#!run

export async function main(){
  try{
    return await this.gsync();
  }catch(e){
    console.log(e.original.stack);
  }
}