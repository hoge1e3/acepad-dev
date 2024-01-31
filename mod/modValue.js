/* global FS*/
//IMPORT END
FS.os.loadModule=function load(path){
    let u=FS.os.createModuleURL(path);
    let id=Math.random()+"";
    var blob = new Blob([
`import * as m from "${u}";
FS.os.loadModule.hooks['${id}'](m);`],
    { type: 'application/javascript' });
    var blobUrl = URL.createObjectURL(blob);
    return new Promise((s,err)=>{
        FS.os.loadModule.hooks[id]=(res)=>{
            URL.revokeObjectURL(blobUrl);
            delete FS.os.loadModule.hooks[id];
            s(res);
        };
        FS.os.loadScriptTag(blobUrl,{
            type:"module"
        }).then(()=>0,err);
    });
};
/*if(!FS.os.loadModule_org){
    FS.os.loadModule_org=FS.os.loadModule;    
}*/
FS.os.loadModule.hooks={};