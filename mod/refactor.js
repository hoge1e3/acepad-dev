import {parse} from "imports.js";
function replFile(f,{from,to}){
    let s=f.text();
    let base=f.up();
    let i=parse(s,base);
    let ss=s;
    if(f.equals(from)){
        if(to.up().equals(base))return ;
        i=i.with({base:to.up()});
    }else{
        i=i.move(from,to);
    }
    s=i.toString();
    if(ss!=s){
        f.text(s);/*
        dprint(f+"\n");
        dprint(s+"\n");*/
    }
}
export function moveFile(home,from,to){
    let files=[];
    home.recursive((f)=>files.push(f));
    for(let f of files){
        if(f.ext()!==".js")continue;
        replFile(f,{from,to});
    }
    from.moveTo(to);
}