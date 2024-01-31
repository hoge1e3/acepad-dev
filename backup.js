import {file2data,data2file} from "acepad-store-file";
import {init,checkout} from "acepad-store";

export async function main(cmd){
    let c=await checkout("backup-1234");
    console.log("co",c);
    let z=this.resolve("/ram/img.zip");
    switch(cmd && cmd[0]) {
        case "b":
            await this.zip("/",z,{excludes:["/ram/"]});
            let nc=await c.commit(file2data(z));
            this.echo("New id=",nc.data.__id__);
            break;
        case "r":
            data2file(c.data, z);
            await this.unzip(z,"/",{overwrite:true});
            this.echo("restored");
            break;
        default:
            this.echo("$0 backup/restore");
    }
}