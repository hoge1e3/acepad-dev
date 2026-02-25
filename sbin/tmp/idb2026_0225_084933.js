#!run

export async function main(){
  const options= {
      "dbName": "petit-fs",
      "storeName": "kvStore"
    }
const prefix = "/idb/run/node_modules/ace-local-commands";

// output all keys begin with prefix
// in indexeddb options.dbName table options.storeName
// and also output values

const req = indexedDB.open(options.dbName);

req.onsuccess = function () {
  const db = req.result;
  const tx = db.transaction(options.storeName, "readonly");
  const store = tx.objectStore(options.storeName);

  const cursorReq = store.openCursor();

  cursorReq.onsuccess = function (e) {
    const cursor = e.target.result;
    if (!cursor) return;

    const key = cursor.key;
    if (typeof key === "string" && key.startsWith(prefix)) {
      console.log("key:", key);
      console.log("value:", 
      typeof cursor.value==="string"?
      cursor.value.substring(0,20):
      cursor.value);
    }

    cursor.continue();
  };

  cursorReq.onerror = function (e) {
    console.error("Cursor error:", e.target.error);
  };
};

req.onerror = function (e) {
  console.error("DB open error:", e.target.error);
};  return ;
}