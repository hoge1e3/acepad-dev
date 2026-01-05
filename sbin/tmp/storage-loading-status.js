#!run
import {getDeviceManager} from "pnode:main";
export async function main(){
  const d=getDeviceManager();
  for (let t of d.df()) {
    //console.log(t.mountPoint, t);
    try {
      const loadedAll=t.
      cachedStorage.//CachedStorage
      raw.//NoCacheStorage
      storage.//MultiSyncIDBStorage
      storage.//SynbIDBStorage
      loadedAll;
      
      const syncIDBStorage=t.
      cachedStorage.//CachedStorage
      raw.//NoCacheStorage
      storage.//MultiSyncIDBStorage
      storage;//SynbIDBStorage
      
      console.log(  syncIDBStorage.getLoadingPromise(true));
      
      //console.log("loadedAll", t.mountPoint, loadedAll);
    }catch(e){
      console.log("loadedAll", t.mountPoint, true);
    }
  }
  return ;
}