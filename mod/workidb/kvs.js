#!run
export class KeyValueStore {
    constructor(dbName = 'keyValueStore', storeName = 'keyValuePairs', version = 1) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.version = version;
        this.db = null;
    }

    // Initialize the database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }

    // Set a value
    async set(key, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(value, key);

            request.onerror = () => {
                reject(request.error);
            };

            request.onsuccess = () => {
                resolve();
            };
        });
    }

    // Get a value
    async get(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onerror = () => {
                reject(request.error);
            };

            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }

    // Delete a value
    async delete(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);

            request.onerror = () => {
                reject(request.error);
            };

            request.onsuccess = () => {
                resolve();
            };
        });
    }

    // Clear all values
    async clear() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onerror = () => {
                reject(request.error);
            };

            request.onsuccess = () => {
                resolve();
            };
        });
    }

    // Get all keys
    async getAllKeys() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAllKeys();

            request.onerror = () => {
                reject(request.error);
            };

            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }

    // Close the database connection
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}
export async function main(){
    // Create and initialize the store
    const store = new KeyValueStore('myApp', 'settings');
    await store.init();
    
    // Store some values
    //await store.set('theme', 'dark');
    //await store.set('language', 'en');
    
    // Retrieve a value
    const theme = await store.get('theme');
    console.log(theme); // 'dark'
    
    // Delete a value
    await store.delete('language');
    
    // Get all keys
    const keys = await store.getAllKeys();
    console.log(keys); // ['theme']
    
    // Clear all data
    //await store.clear();
    
    // Close the connection when done
    store.close();
}