/*global $,$B*/

export async function main(file){
    if(typeof $B==="undefined"){
    await $.getScript("https://brython.info/src/brython.js");
    await $.getScript("https://brython.info/src/brython_stdlib.js");
    }
    file=this.resolve(file);
    let f=new Function( $B.py2js(file.text()).to_js() );
    let mod={};
    $B.imported.exec={}; 
    f();
    return mod;
}