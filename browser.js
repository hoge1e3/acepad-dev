import {appendNode} from "./dom.js";
import {createModuleURL,createURL} from "acepad-os";
export async function open(f){
    let p=new DOMParser();
    let html=f.text();
    const colon=":";
    let d=p.parseFromString(html,"text/html");
    let opt={
        doc:document,
        resolve(p){
            return f.sibling(p);
        },
        toURL(p,n){
            let t=n.getAttribute("type");
            if(t=="module"){
                return createModuleURL(opt.resolve(p));
            }
            return createURL(opt.resolve(p));
        },
        protocol(href,n){
            
        },
        open
    };
    //const s=programmableReadyState();
    //s.value="loading";
    //let h=hack();
    for(let t of ["head","body"]){
        let hd=document.querySelector(t);
        hd.innerHTML="";
        let hs=d.querySelector(t);
        await appendNode(hs, hd, opt);
    }
    /*h.setReadyState("interactive");
    h.setReadyState("complete");
    
    s.value="complete";
    document.dispatchEvent(new Event("readystatechange"));
    const le=new Event("load");
    window.dispatchEvent(le);*/
}
function hack(){
    let h=document.addEventListener.hacked;
    h.readyState=document.readyState;
    if(!h){
        document.addEventListener.hacked=h={};
        Object.defineProperty(document,"readyState",{
            get(){
                return h.readyState;
            }
        });
        h.readystatechange=hackEventListener(
            document,"readystatechange");
        h.load=hackEventListener(
            window,"load");
        h.domcontentloaded=hackEventListener(
            document,"domcontentloaded");
        h.setReadyState=(s)=>{
            h.readyState=s;
            if(h.readyState==="interactive"){
                const e=new Event("DOMContentLoaded");
                for(let f of h.domcontentloaded){
                    f.call(document,e);
                }
            }
            if(h.readyState==="complete"){
                const e=new Event("load");
                for(let f of h.load){
                    f.call(window,e);
                }
            }
            const e=new Event("readystatechange");
            for(let f of h.readystatechange){
                f.call(document,e);
            }
        };
    }
    h.readystatechange.length=0;
    h.readystatechange.push((e)=>{
        if(typeof 
        document.onreadystatechange==="function"){
            document.onreadystatechange(e);
        }
    });
    delete document.onreadystatechange;
    h.domcontentloaded.length=0;
    h.load.length=0;
    h.load.push((e)=>{
        if(typeof 
        window.onload==="function"){
            window.onload(e);
        }
    });
    delete window.onload;
    h.readyState="loading";
    return h;
}
function hackEventListener(o,type){
    const old=o.addEventListener;
    const listeners=[];
    o.addEventListener=function (t,...a){
        if(type.toLowerCase()!==t.toLowerCase()){
            return old.apply(this,[t,...a]);
        }        
        alert(t+a);
        listeners.push(a[0]);
    };
    return listeners;
}

