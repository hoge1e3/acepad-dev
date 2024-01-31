import {resolveModule} from "acepad-os";
export async function main(name){
    let p=findNodeModule(name,this.cwd);
    this.cd(p);
    p=p.rel("package.json").obj();
    this.pwd();
    this.echo(p.scripts.test);
    await this.enterCommand(p.scripts.test);
    //this.echo(p+"");
}
function findNodeModule(name,base){
    for(let p=base;p;p=p.up()){
        let n=p.rel("node_modules/");
        if(n.exists()){
            let p=n.rel(name+"/");
            if(p.exists()){
                return p;
            }
        }
    }
    throw new Error(`${name} not found from ${base}`);
}
