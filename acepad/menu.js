import {events} from './events.js';
import {changeSession,sessionInfo} from './sessions.js';
import {getMenuPos} from './states.js';
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
    let h=$("#editor").height();
    let m=$("<button>").appendTo("#editor").addClass("menu");
    if(!pos.top&&!top.bottom){
        pos.bottom=mp.menuY;
        mp.menuY+=50;
        if(mp.menuY>h-50){
            mp.menuY=0;
            mp.menuX+=50;
        }
    }
    if(!pos.left&&!top.right){
        pos.right=mp.menuX;
    }
    if(!pos.height){
        pos.height=50;
    }
    let p,lastt;
    m.css(pos).html(html).
    on("touchstart",(e)=>{
        m.addClass("touched");
        p=e.originalEvent.touches[0];
        //console.log(p.pageX,p.pageX);
        e.preventDefault();
        e.stopPropagation();
        lastt=new Date().getTime();
    }).on("touchmove",(e)=>{
        let np=(e.originalEvent.touches[0]);
        //console.log(JSON.stringify([pos,p,np]));
        let pp={...pos};
        
        pos.bottom-=np.pageY-p.pageY;
        pos.right-=np.pageX-p.pageX;
        if(pos.bottom>$("#editor").height()-50){
            pos.bottom=pp.bottom;
        }
        if(pos.right>$("#editor").width()-50){
            pos.right=pp.right;
        }
        //console.log($("#editor").height());
        m.css(pos);
        p=np;
        e.preventDefault();
        e.stopPropagation();
    }).on("touchend",(e)=>{
        m.removeClass("touched");
        if(new Date().getTime()-lastt<300){
        cmd(e);
        }
        e.preventDefault();
        e.stopPropagation();
    });
    return m;
}
export function showMenuButtons(d){
    for(let k in d){
        showMenuButton(k,d[k]);
    }
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
    });
}

//showMenuButton({right:0,top:0},"test",()=>editor.renderer.setShowGutter(!editor.renderer.getShowGutter()));
//showMenuButton({left:0,top:0},"test",()=>alert(3))