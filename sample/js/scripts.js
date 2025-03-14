const node_modules="node_modules/";
const package_json="package.json";

function createModuleURL(f){
    let c=urlInCache(f);
    if(c)return c;
    let jsCodeString=f.text();
    let deps=[];
    let base=f.up();
    let a=(path)=>{
        let d=resolveModule(path,base);
        deps.push(d);
        return d;
    };
    let m;
    let after="";
    m=/IMPORT END/.exec(jsCodeString);
    if(m){
        after=jsCodeString.substring(m.index);
        jsCodeString=jsCodeString.substring(0,m.index);
    }
    jsCodeString=jsCodeString.replace(
        /(import\s.*\sfrom\s+["'])(.+)(["'])/g,
        (_,pre,path,post)=>
        pre+
        createModuleURL(a(path))+
        post
    )+after;
    if(jsCodeString.match(/\b__dirname\b/)){
        jsCodeString=`const __dirname=${
            JSON.stringify(base.path())
        };${jsCodeString}`;
    }
    //print(f.name(),jsCodeString);
    return createScriptURL(jsCodeString,f,{deps});
}
function resolveModule(path,base){
    if(path.match(/^\./)){
        return base.rel(path);
    }else if(path.match(/^\//)){
        return FS.get(path);
    }else if(path.match(/^[\w\d\-]+$/)){
        return getMain(findNodeModule(path,base));
    }else {
        throw new Error(`${path} is not valid module path`);
    }
}
function findNodeModule(name,base){
    for(let p=base;p;p=p.up()){
        let n=p.rel(node_modules);
        if(n.exists()){
            let p=n.rel(name+"/");
            if(p.exists()){
                return p;
            }
        }
    }
    throw new Error(`${name} not found from ${base}`);
}
function getMain(p){
    if(p.name()!==package_json){
        p=p.rel(package_json);
    }
    let o=p.obj();
    return p.sibling(o.main);
}
function urlInCache(f){
    let e=urls.get({path:f.path()});
    if(!e)return e;
    const miss=()=>{
        URL.revokeObjectURL(e.url);
        return false;
    };        
    if(f.lastUpdate()>e.lastUpdate)
        return miss();
    for(let f of e.deps){
        if(!urlInCache(f))
            return miss();
    }
    return e.url;
}
function loadModule(f){
    return loadScriptTag(createModuleURL(f),{
        type:"module"
    });
}
function errorHandler(a,b,c,d,e){
    console.log("err2",arguments);
    try{
        var stack=(e&&e.stack)||(a&&a.stack)||"";
        if(b){
            stack+="\n"+[b,c,d].join(":");
        }
        for(var [url,{path}] of urls.maps.url){
            stack=stack.replaceAll(url,path);
        }
        if(!stack){
            stack+=Array.from(arguments).join(" ");
        }
        window.alert(stack);
        var fall="https://bitarrow.eplang.jp/beta2204/fs/pub/06993a21/ebk_ace1228.html";
        if(window.confirm("safe mode?")){
            window.location.href=fall;
        }
    }catch(e){
        alert(e);
    }
}
window.onerror=errorHandler;
function createScriptURL(jsCodeString,f,{deps}){
    var blob = new window.Blob(
    [jsCodeString],
    { type: 'application/javascript' });
    return createURL(f,{blob,deps});
}
function createURL(f,opt={}){
    if(!f.exists()){
        throw new Error(`Cannot createURL ${f}: not exists`);
    }
    let {blob,deps}=opt;
    if(!blob){
        blob=f.getBlob();
    }
    var blobUrl = window.URL.
    createObjectURL(blob);
    let name=f.path();
    urls.set({
        lastUpdate:f.lastUpdate(),
        path:name,url:blobUrl,deps:deps||[]
    });
    return blobUrl;
    // URL.revokeObjectURL(blobUrl);
}
function loadScriptTag(url,attr={}){
    const script = document.createElement('script');
    script.src = url;
    for(let k in attr){
        script.setAttribute(k,attr[k]);
    }
    //script.type="module";

    return new Promise(
        function (resolve,reject){
            script.addEventListener("load",resolve);
            script.addEventListener("error",reject);
            document.head.appendChild(script);
    });
}
async function loadFSjs(){
    if(window.FS)return window.FS;
    let jszip="https://edit.tonyu.jp/js/lib/jszip.min.js";
    let fsjs="https://edit.tonyu.jp/js/fs/FS_umd.js";
    await loadScriptTag(jszip);
    await loadScriptTag(fsjs);
    return window.FS;
}
var MultiKeyMap=class{
    constructor (keys){
        this.maps={};
        for(let key of keys){
            this.maps[key]=new Map();
        }
    }
    get(desc){
        let keyname=Object.keys(desc)[0];
        let keyvalue=desc[keyname];
        return this.maps[keyname].get(keyvalue);
    }
    set(val){
        for(let key in this.maps){
            if((val[key]+"").match(/Object/)){
                console.log(val[key]);
                throw "why";
            }
            this.maps[key].set(val[key],val);
        }
    }
};
var urls=window.urls||new MultiKeyMap(["url","path"]);
window.urls=urls;
/*
var home=getHome();
var loadf=home.rel("mod/moda.js");
loadModule(loadf);*/
//print(urls.get({path:loadf.path()}).deps);
/*setTimeout(()=>
loadHTML(getHome().rel("mod.html")),
1000);
*/
async function init(){
    let FS=await loadFSjs();
    FS.os={
        createModuleURL,
        loadModule,
        createURL,
        loadScriptTag,
    };
    let boot=getMain(FS.get("/"));
    if(boot.exists()){
        await loadModule(boot);
    }else{
        alert("No boot ");
    }
    return FS;
}
init().then(()=>{},(e)=>{alert(e);});

