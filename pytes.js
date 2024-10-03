/*global $,$B*/

export async function main(file){
    
    
    const src=this.resolve("vfs.py").text();
    /*window.use_brython=function use_brython(run){
        let mod=run(`
import foo
print(foo.custom_attribute)
foo.bar()
print(2*4)
`);
        console.log("mod",mod);
    };*/

    const s2=document.createElement("script");
    s2.innerHTML=src;
    s2.setAttribute("type","text/python3");
    document.body.appendChild(s2);
    const load=(src)=>new Promise((suc)=>{
        const s=document.createElement("script");
        s.setAttribute("src",src);
        document.body.appendChild(s);
        s.addEventListener("load",suc);
        
    });
//    const head="https://edit.tonyu.jp/acepad/brython/src";
    const head="https://brython.info";
    await load(`${head}/brython.js`);
    await load(`${head}/brython_stdlib.js`);
    //console.log(Object.keys($B.VFS).length);
    $B.brython();
    //console.log(Object.keys($B.VFS).length);
    //console.log(__BRYTHON__.py_VFS);
    /*
    const s=document.createElement("script");
    s.setAttribute("src","https://edit.tonyu.jp/acepad/brython/src/brython.js");
    document.body.appendChild(s);
    s.addEventListener("load",()=>$B.brython());*/
    /*if(typeof $B==="undefined"){
        let brh="https://edit.tonyu.jp/acepad/brython";
        await $.getScript(`${brh}/src/brython.js`);*/
        /*
        await $.getScript(`${brh}/src/brython_stdlib.js`);
        await $.getScript(`${brh}/src/brython_modules.js`);
        await $.getScript(`${brh}/src/py_VFS.js`);
        await $.getScript(`https://brython.info/src/brython.js`);
        */
    //}
    //$B.brython();
    /*file=this.resolve(file);
    let f=new Function( $B.py2js(file.text()).to_js() );
    let mod={script_path:file.path()};
    $B.imported.exec=mod; 
    f();
    return mod;*/
}