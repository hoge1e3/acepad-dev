#!run

export async function main(){
  const d=this.resolve(this.$home);
  d.watch((t,f,m)=>{
    console.log("watch",f.path());
  });



}