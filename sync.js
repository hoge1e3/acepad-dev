import {init,commit,checkout} from "acepad-sync";

export async function main(cmd, ...args){
    const sh=this;
    const gd=()=>sh.resolve(args.shift()||sh.cwd);
    switch(cmd) {
        case "init":
            return await init(args.shift(),gd());
        case "checkout":
            return await checkout(gd());
        case "commit":
            return await commit(gd());
    }
}