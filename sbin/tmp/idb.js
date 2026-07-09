/*global indexedDB*/
export class Idb{
  static create(dbName, tableName){
    return new Promise(((resolve, reject) => {
    try{
      console.log(-1)
      // まず現在のバージョンを確認するために開く
      const checkReq = indexedDB.open(dbName);
      console.log(checkReq)
      const rf=(f)=>(...a)=>{
        try{
          return f(...a);
        }catch(e){
          reject(e);
        }
      };
      checkReq.onsuccess = rf(() => {
          const db = checkReq.result;
          console.log("version", db.version);
          console.log("tables", [...db.objectStoreNames]);
          console.log(0)
          db.onversionchange = () => {
            console.log("vc")
            db.close();
          };
          if (db.objectStoreNames.contains(tableName)) {
            // 既にテーブルがあればそのまま返す
            resolve(new Idb(db, tableName));
            return;
          }
          console.log(1)
          // テーブルがなければバージョンを上げて作成
          const newVersion = db.version + 1;
          db.close();
          console.log("v",newVersion)
          setTimeout(()=>{
            const upgradeReq = indexedDB.open(dbName, newVersion);
            upgradeReq.onblocked=()=>{
              console.log("bl")
            }
            upgradeReq.onupgradeneeded = rf((ev) => {
              console.log(2)
              const upgradeDb = ev.target.result;
              if (!upgradeDb.objectStoreNames.contains(tableName)) {
                upgradeDb.createObjectStore(tableName);
              }
            });
            upgradeReq.onsuccess = rf(() => {
              console.log(3)
              resolve(new Idb(upgradeReq.result, tableName));
            });
            upgradeReq.onerror = rf(() => reject(upgradeReq.error));
          },1)
          
      });
      checkReq.onerror = rf(() => reject(checkReq.error));
    }catch(e){
      reject(e)
    }
      
    }));
  }
  /*
  fix the error
  InvalidStateError: Failed to read the 'result' property from 'IDBRequest': The request has not finished.
    at file:///idb/ipadic/idbutil.js:19:31
    at rf (file:///idb/ipadic/idbutil.js:10:18)
    at file:///idb/ipadic/idbutil.js:16:28
    at new Promise (<anonymous>)
    at Idb.create (file:///idb/ipadic/idbutil.js:5:12)
    at Proxy.main (file:///idb/ipadic/scan.js:4:21)
    at Proxy.<anonymous> (file:///idb/run/node_modules/@acepad/os-jsm/acepad-os-jsm.js:23:24)
    at async procLine (file:///idb/run/node_modules/@acepad/debug/acepad-debug.js:116:19)

  */
  constructor(db, table){
    this.db = db;
    this.table = table;
  }
  /*static create(dbName,tableName){
    //fixit: open indexeddb and return  Idb instance
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName);
      req.onupgradeneeded = (ev) => {
        const db = ev.target.result;
        if (!db.objectStoreNames.contains(tableName)) {
          db.createObjectStore(tableName);
        }
      };
      req.onsuccess = () => {
        resolve(new Idb(req.result, tableName));
      };
      req.onerror = () => reject(req.error);
    });
  }
  constructor(db, table){
    this.db = db;
    this.table = table;
  }*/
  putAll(iter){
    // iter yields [key,value]
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.table, "readwrite");
      const store = tx.objectStore(this.table);
      for (const [key, value] of iter) {
        store.put(value, key);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
  put(key,value){
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.table, "readwrite");
      const store = tx.objectStore(this.table);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
  get(key){
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.table, "readonly");
      const store = tx.objectStore(this.table);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async *keys() {
    const tx = this.db.transaction(this.table, "readonly");
    const store = tx.objectStore(this.table);
    const req = store.getAllKeys();
    const keys = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    for (const key of keys) {
      yield key;
    }
  }
}