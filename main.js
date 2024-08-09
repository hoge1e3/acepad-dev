import "../../petit-node/dost/index.js";
alert(globalThis.pNode);
function loadScriptTag(url,attr={}){
    if ((attr.type!=="module") && 
    typeof define==="function" && 
    define.amd && typeof requirejs==="function") {
        return new Promise((s)=>requirejs([url],(r)=>s(r)));
    }
    const script = document.createElement('script');
    script.src = url;
    for(let k in attr){
        script.setAttribute(k,attr[k]);
    }
    return new Promise(
        function (resolve,reject){
            script.addEventListener("load",resolve);
            script.addEventListener("error",reject);
            document.head.appendChild(script);
    });
}
function installPWA(){
    document.head.innerHTML+=`<link rel="manifest" href="acepad/manifest.json"/>`;
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('acepad/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
}
async function unzipURL(url, dest) {
    status("Fetching: "+url);
    const response = await fetch(url);
    console.log(response);
    let blob=await response.blob();
    return await unzipBlob(blob,dest);
}
async function unzipBlob(blob, dest) {
    status("unzipping blob ");
    let zip=FS.get("/ram/setup.zip");
    await zip.setBlob(blob);
    dest.mkdir();
    await FS.zip.unzip(zip,dest);
}
async function networkBoot(url){
    const run=FS.get("/ram/run/");
    await unzipURL(url, run);
    status("Boot start!");
    FS.os.boot(run);
}
function getQueryString(key, default_) {
    if (arguments.length === 1) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(location.href);
    if (qs == null) return default_;else return decodeURLComponentEx(qs[1]);
}
function decodeURLComponentEx(s) {
    return decodeURIComponent(s.replace(/\+/g, '%20'));
}
addEventListener("load",async ()=>{
    try {
        await init();
    }catch(e){alert(e);}
});