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
    const head="https://brython.info";
    await load(`${head}/brython.js`);
    await load(`${head}/brython_stdlib.js`);
    $B.brython();
}