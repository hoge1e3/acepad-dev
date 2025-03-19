#!run 
class SyncStorage {
    constructor(dbName = "SyncStorageDB", storeName = "kvStore", cacheLimit = 100) {
        this.db = null;
        this.memoryCache = {}; // メモリキャッシュ
        this.cacheKeys = new Set(); // localStorage にキャッシュしているキー
        this.dbName = dbName;
        this.storeName = storeName;
        this.cacheLimit = cacheLimit;
        //this._initDB();
    }
    async _initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
            request.onsuccess = (event) => {
                this.db = event.target.result;
                this._loadAllData().then(resolve).catch(reject);
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }
    /** localStorage のデータをメモリキャッシュにロードし、IndexedDB のデータを補完 */
    async _loadAllData() {
        return new Promise((resolve, reject) => {
            // 1. localStorage のデータをメモリキャッシュにロード
            console.log("loadAll1");
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key !== null) {
                    const value = localStorage.getItem(key);
                    if (value !== null) {
                        this.memoryCache[key] = value;
                        this.cacheKeys.add(key);
                    }
                }
            }
            console.log("loadAll2");
            // 2. IndexedDB からデータを取得（localStorage にないデータのみ追加）
            const transaction = this.db.transaction(this.storeName, "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.getAllKeys();
            request.onsuccess = async () => {
                const keys = request.result;
                const values = await Promise.all(keys.map(key => this._getFromIndexedDB(key)));
                keys.forEach((key, i) => {
                    if (!(key in this.memoryCache)) {
                        this.memoryCache[key] = values[i] ?? "";
                    }
                });
                console.log("loadAll3");
                resolve();
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }
    getItem(key) {
        return this.memoryCache[key] ?? null;
    }
    setItem(key, value) {
        localStorage.setItem(key, value);
        this.memoryCache[key] = value;
        this.cacheKeys.add(key);
        /*if (this.cacheKeys.size > this.cacheLimit) {
            const firstKey = this.cacheKeys.values().next().value;
            localStorage.removeItem(firstKey);
            this.cacheKeys.delete(firstKey);
        }*/
        this._saveToIndexedDB(key, value);
    }
    removeItem(key) {
        localStorage.removeItem(key);
        delete this.memoryCache[key];
        this.cacheKeys.delete(key);
        this._deleteFromIndexedDB(key);
    }
    async _getFromIndexedDB(key) {
        return new Promise((resolve, reject) => {
            if (!this.db)
                return resolve(null);
            const transaction = this.db.transaction(this.storeName, "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result ?? null);
            request.onerror = () => reject(request.error);
        });
    }
    async _saveToIndexedDB(key, value) {
        return new Promise((resolve, reject) => {
            if (!this.db)
                return resolve();
            const transaction = this.db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.put(value, key);
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }
    async _deleteFromIndexedDB(key) {
        return new Promise((resolve, reject) => {
            if (!this.db)
                return resolve();
            const transaction = this.db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }
}
export async function main(){
    const s=new SyncStorage();
    await s._initDB();
    /*for (let k in localStorage) {
        if (typeof localStorage[k]!=="string") continue;
        s.setItem(k, localStorage[k]);
    }*/
    this.echo("done",s);
}