import FS from "@hoge1e3/fs";
import * as readline from "readline";

function input(prompt="") {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
async function inputCmd(){
    return JSON.parse(await input());
}

// Usage example:
async function main() {
    const path=process.argv[2];
    const dir=FS.get(path);
    outree(dir);
    const {tree}= await inputCmd();
    updown(tree);
   // console.log(`Hello, ${name}!`);
}
function outree(dir){
    const tree=dir.getDirTree({
        style:"flat-relative",
    });
    console.log(tree);
    outCmd({cmd:"sync",step:"rmtree",tree});
    
}
function updown(tree){
    const dl={};
    for(let k in tree){
        const v=tree[k];
        if(typeof v==="number"){
            
        }
    }
}
function entry(f,e){
    if(!e){
        
    }
}
function outCmd(cmd){
    const cmdj=JSON.stringify(cmd);
    console.log(`\x1b]10;${cmdj}\x07\n`);
}

main();
/*
setMetaInfo: function (path, info, options) { 
E(path, info, options);      
        this.assertExist(path, options);        
        const s = this.stat(path);      
        let atime=s.atime.getTime();      
        let mtime=s.mtime.getTime();      
        if (info.lastUpdate) {         
            mtime=info.lastUpdate;          
            const np = this.toNativePath(path);      
            fs.utimesSync(np, atime, mtime);      
        }  
},