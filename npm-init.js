import {sh} from "acepad-shell";
sh.addCmd("npm-init",function (name){
    let n=findNodeModuleRoot(this.resolve("."));
    n=n.rel(name+"/");
    if(n.exists()){
        throw new Error(`${name} exists`);
    }
    n.mkdir();
    let main=`${name}.js`;
    n.rel("package.json").obj({
        main,
    });
    n.rel(main).text("// "+name+"\n");
    this.edit(n.rel(main));
});    

function findNodeModuleRoot(base){
    for(let p=base;p;p=p.up()){
        let n=p.rel("node_modules/");
        if(n.exists()){
            return n;
        }
    }
    throw new Error(`node_modules/ not found from ${base}`);
}