//!run
import {init,commit,checkout,clone} from "@acepad/sync";

export async function main(cmd, ...args){
    const sh=this;
    const gd=()=>sh.resolve(args.shift()||sh.getcwd());
    switch(cmd||"auto") {
        case "init":
            return await init(args.shift(),gd());
        case "checkout":
            return await checkout(gd());
        case "commit":
            return await commit(gd());
        case "clone":
            return await clone(args.shift(),gd());
        case "auto":
            await checkout(gd());
            return await commit(gd());
        default:
            sh.echo("sync init/clone/checkout/commit");
    }
}