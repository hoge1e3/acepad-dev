const logdirpath="/log/";
const thresh=10000;
let alerted;
export function add(sh,data){
    const logdir=sh.resolve(logdirpath);
    if(!logdir.exists())logdir.mkdir();
    const logfile=logdir.rel("keyclick.json");
    let logdata=[];
    try{
        logdata=logfile.obj();    
    }catch(e){}
    data.time=new Date().getTime();
    logdata.push(data);
    logfile.obj(logdata);
    if(logdata.length>=thresh&&!alerted){
        //console.log(logdata.length);
        alert("dumplog");
        alerted=true;
    }
}
function moveToTmp(sh,logdir){
    
}