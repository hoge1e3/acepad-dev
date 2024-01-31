function replFile(f,{from,to}){
    let s=f.text();
    let ss=s;
    s=s.replace(
        /(import\s.*\sfrom\s+["'])(.+)(["'])/g,
        (_,pre,path,post)=>{
         let df=f.sibling(path);
         if(f.path()==from.path()){
             return `${pre}${relSibling(df,to)}${post}`;
         }else if(df.path()==from.path()){
             return `${pre}${relSibling(to,f)}${post}`;
         }else{
             return _;
         }
        }
    );
    if(ss!=s){
        f.text(s);/*
        dprint(f+"\n");
        dprint(s+"\n");*/
    }
}
function relSibling(f,base){
    return f.relPath(base.up());
}
function moveFile(home,from,to){
    let files=[];
    home.recursive((f)=>files.push(f));
    for(let f of files){
        replFile(f,{from,to});
    }
    from.moveTo(to);
}