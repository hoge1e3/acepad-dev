#!run
import * as fs from "fs";
export function main(){
    const dir=this.$home;
    this.echo("list of ",dir);
    for(let f of fs.readdirSync(dir)){
        this.echo(f);
    }
    this.echo("(press F1 to switch this session).");
}
/*
F5: run
F1: switch session(buffer)
*/