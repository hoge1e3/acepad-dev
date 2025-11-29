//@ts-check
/** 
 * @typedef { import("./types.ts").SFile } SFile
 * @typedef { import("./types.ts").Menus } Menus
 * @typedef { import("./types.ts").Menu } Menu
 * @typedef { import("./types.ts").ShowModal } ShowModal
 * @typedef { import("./types.ts").RootPackageJSON } RootPackageJSON
 * @typedef { import("./types.ts").WSFileInfo } WSFileInfo
 */

import MutablePromise from "mutable-promise";
/**
 * 
 * @param {SFile} home 
 * @returns 
 */
export function init(home) {
    /**
     * @param {string} relPath 
     * @returns {SFile}
     */
    function resolve(relPath) {
        relPath=relPath.replace(/\\/g,"/");
        //console.log("resolving",path,path.startsWith("/"));
        return home.rel(relPath);
    }
    const mp=new MutablePromise();
    const ws = new WebSocket("ws://localhost:8080");
    //const files = {}; // path -> {mtime, content}
    /**@type (...a:any[])=>void */
    const log=(...a)=>console.log("websocket",...a);
    ws.addEventListener("open", () => {
        log("connected");
    });
    ws.addEventListener("close", () => {
        alert("Websocket disconnect");
    });
    ws.addEventListener("error", (e) => {
        alert("Websocket Error");
        console.error(e);
    });
    ws.addEventListener("message", e => {
        const _data = JSON.parse(e.data);
        if (_data.type === "update") {
            const { path: relPath, info } = _data;
            const cur = readFile(relPath);
            if (!cur || info.mtime > cur.mtime) {
                writeFile(relPath, info, true);
                log("updated from server: " + relPath);
            }
        } else if (_data.type === "delete") {
            const { path:relPath } = _data;
            deleteFile(relPath, true);
            log("deleted from server: " + relPath);
        }
    });
    startWatch();
    mp.resolve(void 0);
    function startWatch(){
        home.watch((type, file)=>{
            const fullPath=file.path();//relPath(home);
            const relPath=file.relPath(home);
            //console.log(type,path, home.path(), file.path());
            if (file.isDir()) return;
            setTimeout(()=>{
                try {
                    if (file.exists()) {
                        ws.send(JSON.stringify({
                            type: "update",
                            path: relPath,
                            info: readFile(relPath),
                        }));
                    } else {
                        if (relPath.match(/\b\.gsync\b/)) {
                            alert("Suspicious file deletion! "+fullPath);
                            return;
                        }
                        ws.send(JSON.stringify({
                            type: "delete",
                            path: relPath
                        }));
                    }
                }catch(e) {
                    alert(e);
                }
            },100);
        });
    }

    /**
     * 
     * @param {string} relPath 
     * @returns 
     */
    function readFile(relPath) {
        const f=resolve(relPath);
        return f.exists() ? {mtime: f.lastUpdate(), content:f.dataURL()} : null ;// files[path] || null;
    }
    /**
     * 
     * @param {string} relPath 
     * @param {WSFileInfo} info 
     * @param {boolean} nosend 
     * @returns 
     */
    function writeFile(relPath, info, nosend) {
        const f=resolve(relPath);
        //console.log("path-info",path, info);
        f.dataURL(info.content);
        //files[path] = info;
        if (nosend) return;
        ws.send(JSON.stringify({
            type: "update",
            path: relPath,
            info
        }));
    }
    /**
     * 
     * @param {string} path 
     * @param {boolean} nosend 
     * @returns {WSFileInfo|undefined}
     */
    function deleteFile(path, nosend) {
        const f=resolve(path);
        if (!f.exists()) return;
        f.rm();//    delete files[path];
        if (nosend) return;
        ws.send(JSON.stringify({
            type: "delete",
            path
        }));
    }
    return mp;
}