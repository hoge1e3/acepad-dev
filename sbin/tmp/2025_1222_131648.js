#!sweval
//console.log("ev")
async function main(){
  try{
    const cache=await getCache();
    console.log("c",!!cache);
    const url=self.registration.scope+"tmp-gen/test";
    cache.put(
      url,
      new Response("body", 
      {
          headers: { "Content-Type": "text/plain" }
        })
    )
    console.log("putt",url)
  //  return ;
  //}
  //main()
  }catch(e){
    console.error(e+"");
  }
}
main();