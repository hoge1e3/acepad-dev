const logdirpath="/log/";
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
    
}
function moveToTmp(sh,logdir){
    
}