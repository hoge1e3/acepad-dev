#!run
//test
export async function main(){
  for (let f of pNode.getDeviceManager().df()){
      if (f.mountPoint==="/idb") {
        this.watch(()=>f.cachedStorage.hasUncommited());
      }
  }
  return ;
}

