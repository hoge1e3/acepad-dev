
(async function(){
    try{
        if(typeof loadModule==="function"){
            return ;
        }
        if(!FS.os){
        await eval2("scripts.js");   
        }
        sh.addCmd("jsm",(f)=>
            FS.os.loadModule(f),"f");
        sh.addCmd("testjs",async (f)=>{
            let mod=await FS.os.loadModule(f);
            return await mod.test();
        },"f");
        if(!FS.os.loadModule.hooks){
        await sh.jsm("./mod/modValue.js");
        }
        let {open}=await sh.jsm("./browser.js");
        sh.addCmd("page",open,"f");
        //await FS.os.loadModule(sh.resolve("npm-init.js"));
        //alert(sh["npm-init"]);
    }catch(e){  
        alert(e.stack);
    }
})();