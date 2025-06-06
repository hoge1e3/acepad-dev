#!run
// @acepad/sketch
import {show} from "@acepad/widget";
import {generator} from "@hoge1e3/dom";
import css from "@acepad/css";
export function main(){
    const dir=this.resolve(this.$sketchbook||
    this.$home+"/sketchbook");
    let newfile=createFilename();//"0000_0000_000000.jpg";
    let filename=newfile;
    const w=show({fullscreen:true});
    w.element.style["background-color"]="gray";
    const t=generator();
    const density=2;
    const bg="#fff";
    let mode="pen";
    const modes=["pen", "erase", "stamp"];
    css(this.resolve("./sketch.css"));
    const cs=[1600,1200];//mul(vps,density);//[width*density,height*density];
    const d=showMenu();

    const vp=(t.div(
        {
            class: "sketch-viewport",
            ontouchstart,
            ontouchmove,
            ontouchend,
        },t.div({
            class: "sketch-transformer",
        },t.canvas({
            width:cs[0],
            height:cs[1],
        })))
    );
    w.print(vp);
    //vp.addEventListener("touchstart",()=>console.log("touced"));
    const transformer=vp.querySelector(
        ".sketch-transformer");
    const c=vp.querySelector("canvas");
    
    /*Object.assign(vp.style,{
        left:`${0}px`,
        top:`${0}px`, 
        width:`${vps[0]}px`,
        height:`${vps[1]}px`,
    });*/
    const vpso=vp.getBoundingClientRect();
    const vps=[vpso.width,vpso.height];
    const vpm=mul(vps,0.5);
    
    const ctx=c.getContext("2d");
    const hcs=mul(cs,0.5);
    const cofs=mul(sub(vps,cs),0.5);
    Object.assign(c.style,{
        position:"absolute",
        left:`${cofs[0]}px`,
        top:`${cofs[1]}px`, 
        width:`${cs[0]}px`,
        height:`${cs[1]}px`,
    });
    
    ctx.translate(...hcs);
    ctx.strokeStyle="black";
    load(dir.rel(filename));
    ctx.globalAlpha=0.5;
    function showMenu(){
        //console.log("showMenu",filename);
        return w.print(t.div({
            id:"sketch-menu",
            class:"over-canvas",
        },
        ...modes.map(m=>
        t.button({
            onclick:()=>setMode(m),
            class:mode===m?"selected":"",
        },m)),
        t.span(filename),
        t.button({onclick:prev},"<<"),
        t.button({onclick:next},">>"),
        t.button({onclick:rm},"rm"),
        ));
    }
    function setMode(m){
        mode=m;
        switch(mode){
            case "erase":
            ctx.strokeStyle=bg;
            ctx.lineWidth=50/transform.scale;
            break;
            case "pen":
            ctx.strokeStyle="black";
            ctx.lineWidth=1;
            break;
        }
        showMenu();
    }
    //let px,py;
    let pinch0;
    let transform={scale:1,translate:[0,0]};
    let transform0;
    let tcount=0;
    //let pivot;
    function ontouchstart(e){
        tcount++;
        console.log("ontouchstart",e);
        const vp0=t2vp(e.touches[0]);
        console.log("vp0",vp0);
        if(e.touches.length>1){
            const vp1=t2vp(e.touches[1]);
            pinch0={
                d:dist(vp1,vp0),
                v:mid(vp1,vp0),
            };
            transform0=transform;
            // pinch0.p = transform0^-1 * pinch0.v
            pinch0.p=conv(pinch0.v,transform);
            e.stopPropagation();
            e.preventDefault();
            return ;
        }
        ctx.beginPath();
        const [dx,dy]=conv(vp0,transform);
        ctx.moveTo(dx,dy);
        e.stopPropagation();
        e.preventDefault();
            
        //[px,py]=[x,y];
    }
    function ontouchmove(e){
        const vp0=t2vp(e.touches[0]);
        if(e.touches.length>1&&pinch0){
            const vp1=t2vp(e.touches[1]);
            const pinch={
                d:dist(vp1,vp0),
                v:mid(vp1,vp0)
            };
            const s0=transform0.scale;
            const s=s0*pinch.d/pinch0.d;
            const v=pinch.v;
            const p=pinch0.p;
            /*
            pinch0.p = transform0^-1 * pinch0.v
            pinch0.v = transform0 * pinch0.p

            pinch.p = pinch0.p = transform0^-1 * pinch0.v
                               = transform^-1 * pinch.v
            pinch.v = transform * p   
            v[0]    |s  0 T[0]|   p[0]
            v[1] =  |0  s T[1]|   p[1]
             1      |0  0  1  |    1
            v[0]=s*p[0]+T[0]

            T[0]=v[0]-s*p[0]
            */
            transform={
                scale: s,
                translate: [
                    v[0]-s*p[0],
                    v[1]-s*p[1],
                ]
            };
            transformer.style.transform = trstr(transform);
            e.stopPropagation();
            e.preventDefault();
            return;
        }
        if(pinch0)return ;

        const [dx,dy]=conv(vp0,transform);
        ctx.lineTo(dx,dy);
        ctx.stroke();
        ctx.beginPath();    
        ctx.moveTo(dx,dy);
        e.stopPropagation();
        e.preventDefault();
    }
    function ontouchend(e){
        tcount--;
        console.log("tend",tcount,e.touches);
        //ctx.endPath();
        if(e.touches.length<=0){
            if(!pinch0){
                save(dir.rel(filename));
            }
            pinch0=null;
            transform0=null;
            if(mode==="erase"){
                ctx.strokeStyle=bg;
                ctx.lineWidth=50/transform.scale;
            }
        }
    }
    function t2vp(t){
        const rect=vp.getBoundingClientRect();
        const ofs=[rect.left,rect.top];
        return sub(sub([t.clientX,t.clientY],ofs),vpm);
    }
    async function prev(){
        const n=older()||filename;
        console.log("prev",n);
        if(n===filename)return ;
        await load(dir.rel(n));
    }
    function older(){
        const f=files(dir);
        let i=f.indexOf(filename);
        console.log("older",f,filename,i);
        if(i<0)return f[f.length-1]||newfile;
        return f[i-1];
    }
    async function next(){
        const n=newer()||filename;
        if(n===filename)return ;
        await load(dir.rel(n));
    }
    async function rm(){
        if(confirm("del "+filename));
        const n=newer();
        const f=dir.rel(filename);
        if(!f.exists())return ;
        f.rm();
        load(dir.rel(n));
    }
    function newer(){
        const f=files(dir);
        let i=f.indexOf(filename);
        if(i<0)return newfile;
        return f[i+1]||newfile;
    }
    function save(file){
        const d=c.toDataURL('image/jpeg');
        file.dataURL(d);
        filename=file.name();
        showMenu();
        if(filename===newfile){
            newfile=createFilename();
        }
    }
    async function load(file){
        ctx.fillStyle=bg;
        ctx.globalAlpha = 1;
        ctx.clearRect(...mul(hcs,-1),...cs);
        ctx.fillRect(...mul(hcs,-1),...cs);
        ctx.globalAlpha = 0.5;
        filename=file.name();
        showMenu();
        if(!file.exists())return;
        return new Promise(s=>{
            // create img element
            const im = new Image();
            // Ensure the image is loaded before drawing
            im.onload = function () {
                console.log("im", im.src); // src should be correct
                ctx.globalAlpha = 1;
                ctx.drawImage(im, ...mul(hcs,-1));
                ctx.globalAlpha = 0.5;
                s();
            };
            im.src = file.dataURL();
        });
    }
}
function trstr(transform){
    const t=`translate(${transform.translate[0]}px,${transform.translate[1]}px)`;
    const s=`scale(${transform.scale})`;
    return t+" "+s;
}
function conv(p,t){
    // returns t^-1 * p 
    return mul(sub(p,t.translate),1/t.scale);
}
function mid(a,b){
    return a.map((v,i)=>((v+b[i])/2));
}
function sub(a,b){
    return a.map((v,i)=>(v-b[i]));
}
function add(a,b){
    return a.map((v,i)=>(v+b[i]));
}
function mul(a,k){
    return a.map(v=>v*k);
}
function dist(a,b){
    const [x,y]=sub(a,b);
    return Math.sqrt(x**2+y**2);
}
function files(dir){
    return [...dir.listFiles()].
    filter(f=>f.ext()===".jpg").sort(
        (a,b)=>a.lastUpdate()-b.lastUpdate()).
        map(f=>f.name());
}
function createFilename() {
    // Get current date and time
    let now = new Date();
    
    // Format components with leading zeros if necessary
    let yyyy = now.getFullYear();
    let MM = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    let dd = String(now.getDate()).padStart(2, '0');
    let HH = String(now.getHours()).padStart(2, '0');
    let mm = String(now.getMinutes()).padStart(2, '0');
    let ss = String(now.getSeconds()).padStart(2, '0');

    // Construct the filename
    return `${yyyy}_${MM}${dd}_${HH}${mm}${ss}.jpg`;
}

