import {main} from "./cli-ace.js";
const prjPath=process.argv[2];
const run=process.argv.indexOf("-r")>=0;
const daemon=process.argv.indexOf("-d")>=0;
const rename={idx:process.argv.indexOf("-ren")} as {
    idx:number,
    do?:boolean,
    from?:string,
    to?:string,
};
await main({run,daemon,rename}, ...process.argv.filter(e=>!e.startsWith("-")));
