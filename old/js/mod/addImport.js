import {parse} from "imports.js";

export function scanDecl(f,symbol){
    const decl=new RegExp(
    `export\\s+(var|let|const|function|class)`+
    `(\\s*=\\s*|\\s+)\\b${symbol}\\b`
    );    
    //print(decl);
    return decl.exec(f.text());
}
export function addImport(home,src,symbol){
    let files=[];
    home.recursive((f)=>files.push(f));
    let e=parse(src.text(),src.up()),ee;
    for(let f of files){
        if(f.ext()!==".js")continue;
        if(scanDecl(f,symbol)){
            ee=e.add(symbol,f);
            break;
        }
    }
    //print(ee);
    if(!ee)throw new Error(`${symbol} not found`);
    src.text(ee+"");
}