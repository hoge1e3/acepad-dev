import {events} from './events.js';
import {changeSession,sessionInfo} from './sessions.js';
import {getMenuPos,getEditor} from './states.js';
/* global $,events,changeSession,sessionInfo*/
export function showMenuButton(pos,html,cmd){
    if(!cmd){
        cmd=html;
        html=pos;
        pos={};
    }
    pos=pos||{};
    let mp=getMenuPos();
    mp.menuY=mp.menuY||0;
    mp.menuX=mp.menuX||0;
    let editor=getEditor();
    let container=$(editor.container);
    let h=container.height();
    let m=$("<button>").appendTo(container).addClass("menu");
    if(!pos.top&&!pos.bottom){
        pos.bottom=mp.menuY;
        mp.menuY+=50;
        if(mp.menuY>h-50){
            mp.menuY=0;
            mp.menuX+=50;
        }
    }
    if(!pos.left&&!pos.right){
        pos.right=mp.menuX;
    }
    if(!pos.height){
        pos.height=50;
    }
    let p,lastt;
    const touchstart=(e)=>{
        m.addClass("touched");
        //console.log(e.originalEvent);
        const o=e.originalEvent;
        p=o.touches?o.touches[0]:o;
        //console.log(p.pageX,p.pageX);
        e.preventDefault();
        e.stopPropagation();
        lastt=new Date().getTime();
    };
    const touchmove=(e)=>{
        const o=e.originalEvent;
        let np=(o.touches?o.touches[0]:o);
        if (!p) return;
        //console.log(JSON.stringify([pos,p,np]));
        let pp={...pos};
        
        pos.bottom-=np.pageY-p.pageY;
        pos.right-=np.pageX-p.pageX;
        if(pos.bottom>container.height()-50){
            pos.bottom=pp.bottom;
        }
        if(pos.right>container.width()-50){
            pos.right=pp.right;
        }
        m.css(pos);
        p=np;
        e.preventDefault();
        e.stopPropagation();
    };
    const touchend=(e)=>{
        m.removeClass("touched");
        if(new Date().getTime()-lastt<300){
            e.editor=getEditor();
            cmd(e);
        }
        e.preventDefault();
        e.stopPropagation();
        p=null;
    };
    m.css(pos).html(html).
    on("touchstart",touchstart).
    on("touchmove",touchmove).
    on("touchend",touchend).
    on("mousedown",touchstart).
    on("mousemove",touchmove).
    on("mouseup",touchend);
    const isTextOverlapped=()=>{
        let r=rect(self);
        let x=r.left;
        let y=r.top;
        let {row,column}=editor.renderer.pixelToScreenCoordinates(x, y); 
        let {row:row2,column:column2}=
            editor.renderer.pixelToScreenCoordinates(
            x+r.width, y+r.height); 
        let s=editor.session.getLines(row,row2).
        map((s)=>s.substring(column,column2)).
        join("");
        return s.length;
    };
    let ti=setInterval(()=>{
        if(isTextOverlapped()){
            m.css({opacity:"30%"});
        }else m.css({opacity:"100%"});
    },100);
    const self={
        element:m[0],
        isTextOverlapped,
        text:m.text.bind(m),  
        remove(){
            m.remove();
            clearInterval(ti);
        },
    };
    return self;
}
function rect(m){
    let j=$(m.element);
    let o=j.offset();
    o.width=j.width();
    o.height=j.height();
    return o;
}
function all(editor){
    return editor.container.querySelectorAll(".menu");    
}
export function showMenuButtons(d){
    for(let k in d){
        showMenuButton(k,d[k]);
    }
}
let prevs;
export function initMenuButtons(){
    events.on("createSession",({name,session})=>{
        console.log(name);
        let m;
        let si=sessionInfo(session);
        si.on("infochanged",(d)=>{
            m.text(d.name);
        });
        m=showMenuButton(name,()=>{
            changeSession(session);
        }); 
        si.on("remove",()=>{
            m.remove();
        });
        si.menuButton=m;
    });
    events.on("changeSession",({oldSession,session})=>{
        let si=sessionInfo(session);
        let osi=sessionInfo(oldSession);
        if(!si.menuButton||!osi.menuButton)return ;
        $(osi.menuButton.element).removeClass("selected");
        $(si.menuButton.element).addClass("selected");
        
    });
    
}

//showMenuButton({right:0,top:0},"test",()=>editor.renderer.setShowGutter(!editor.renderer.getShowGutter()));
//showMenuButton({left:0,top:0},"test",()=>alert(3))