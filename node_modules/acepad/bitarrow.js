import {print} from './cursor.js';
import {autoexec,selHome} from './boot.js';
import {showIframe} from './iframe.js';
import {getHome} from './states.js';
import {sh} from './shell.js';

export function compileBitArrow(project, file) {
    return new Promise((s,error)=>{
        let i;
        window.sendURL=function (r) {
            //i.parentNode.removeChild(i)
            //alert(r);
            if(typeof r==="string"){
                s( r);   
                i.go(r);

            }else{
                error(r);
                i.close();
                print(r);
            }
        };
        let url=`/beta2204/?r=jsl_edit&dir=${project}&ALWAYS_UPLOAD=1&autoexec=${file}`;
        i=showIframe(url);
    });
}
export async function runBitarrow(f,post){
    const home=getHome();
    if(typeof f==="string"){
        if(f.match(/^\//)){
            f=FS.get(f);
        }else{
            f=home.rel(f);
        }
    }
    if(f.isDir()){
        throw new Error(f+" is dir");
    }
    let u=await compileBitArrow(f.up(),f.name(),post);
    //window.open(u);
}
export async function putFile(f,dst=""){
    const home=getHome();
    return await $.post("/beta2204/?putFiles",{
        base:"/pub/8561df99/"+dst,
        data:JSON.stringify({
            [f.relPath(home)]:{
                text:f.text(),
                lastUpdate:f.lastUpdate(),
            }
        })
    });
}
sh.pf=(f,d)=>{
    return putFile(sh.resolve(f),d);
};
export async function listProjects(){
    let r=await $.get("/beta2204/?Project/list");
    r=r.map(e=>e.name);
    let u=JSON.parse(
        await $.get("/beta2204/?Login/curStatus")
        );
    //console.log(u,r);
    let h=FS.get("/home/").rel(u.class+"/").
    rel(u.user+"/");
    r=r.map(n=>h.rel(n));
    return r;
}
export async function initProject(f){
    let url=`/beta2204/?r=jsl_edit&dir=${f}`;
    i=showIframe(url);
    while(!f.exists()){
        await sh.sleep(0.1);
    }
}
export async function selProject(f){
    if(f){
        if(typeof f=="string"){
            f=FS.get(f)
        }
        if(!f.exists()) await initProject(f);
        selHome(f.path());
        return ;
    }
    let p=await listProjects();
    for(let e of p){
        print(`selProject("${e}")\n`);
    }
}


