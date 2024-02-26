import {getEditor} from './states.js';
import {setLongtap} from './longtap.js';
import {modifierKeys,addModifierStyle,renderModifierState,setModifier} from './modifier.js';
import {events} from './events.js';
//keypad
//addEventListener("visibilitychange", (event) => {});
/*global $*/
export let _doClick;
export function initKeypad({pressHandler}){
    _doClick=pressHandler;
    const editor=getEditor();
    const k=document.getElementById('keypad');
    trimTextNode(k);
    for(let e of $(".chr")){
        let syms=e.innerText;
        if (syms[0].toLowerCase()!==syms[0].toUpperCase()) {
            syms=syms[0].toLowerCase()+syms[0].toUpperCase()+syms.substring(1);
            $(e).empty().append(
                $("<span>").addClass("mask").addClass("no-shift").text(syms[0])
            ).append(
                $("<span>").addClass("mask").addClass("shift").text(syms[1])
            );
            if (syms[2]) {
                $(e).find(".mask").addClass("no-sym");
                $(e).append(
                   $("<span>").addClass("mask").addClass("sym").text(syms[2])
                );
            }
        } else if (syms.length==2){
            $(e).empty().append(
                $("<span>").addClass("mask").addClass("no-sym").text(syms[0])
            ).append(
                $("<span>").addClass("mask").addClass("sym").text(syms[1])
            );
        }
    }   
    for(let b of document.querySelectorAll("#keypad button")) {
        setLongtap(b,{
            start(){
                doClickRender(b);
            },
            autorepeat:b.classList.contains("autorepeat")
        });
        let m=b.getAttribute("data-modifier");
        if(m){
            modifierKeys[m]=1;
        }
    }
    addModifierStyle();
    justifyAll();

    //console.log()
}
export function hasSym(){
    const s=document.querySelector("[data-modifier='sym']");
    return s&&!isHidden(s);
}
export function justifyAll(){
    $(".justify").each(function (){
        initJustify(this);
    });

}
export function initJustify(e){
    const r=new ResizeObserver((ev)=>{
        justify(e);
    });
    r.observe(e);
    justify(e);
}

export function justify(row){
    if(isHidden(row))return ;
    let r=[...row.childNodes].filter(
        (node)=>
        node.nodeType === Node.ELEMENT_NODE&&
        !isHidden(node)
    );
    let len=r.length;
    let p=Math.floor(1000/len)/10;
    for(let e of r){
        $(e).css({width:p+"%"});
    }
}
export function trimTextNode(container) {
    const nodes = [...container.childNodes];
    for (const node of nodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') {
            container.removeChild(node);
        } else trimTextNode(node);
    }
}
export function isHidden(el) {
    return (el.offsetParent === null);
}
export function getDatas(e,res){
    res=res||{};
    for(let a of Array.from(e.attributes)){
        a.name.replace(/^data-(.*)/,
        (_,n)=>{
            res[n]=a.value;
        });
    }
    for(let c of e.childNodes){
        if(isHidden(c))continue;
        if (c.nodeType!==Node.ELEMENT_NODE)continue;
        getDatas(c,res);
    }
    if (!res.command && !res.text && 
    !res.modifier && !res.keycode) res.text=e.innerText;
    return res;
}
export function doClickRender(b) {
    events.fire("keyclick",{b});
    _doClick(b);
    renderModifierState();
}
export function toggleSym(){
    if(!hasSym())return ;
    setModifier("sym",2);
    renderModifierState();
    return ;
}
export function showGuide(b,size=10) {
    if(typeof b==="string"){
        b=textToButton()[b];
    }
    if (!b) return;
    if(isHidden(b))return ;
    const r=b.getBoundingClientRect();
    const res=$("<span>").addClass("guide").appendTo("body");
    res.css({
        left: r.left-size,
        top: r.top-size,
        width: r.width+size*2,
        height: r.height+size,
        zIndex:300001+size,
    });
    res.text(b.innerText);
    res[0].addEventListener("touchstart",(e)=>{
        doClickRender(b);
        res.remove();
        e.preventDefault();
        return false;
    });
    setTimeout(shrink,500);
    function shrink() {
        if (isHidden(res)) return;
        res.css({
            left: r.left-size,
            top: r.top-size,
            width: r.width+size*2,
            height: r.height+size,
        });
        size--;
        if (size>0) setTimeout(shrink,500);
        else res.remove();
    }
    return res;
}
export function textToButton(){
    const res={};
    for(let b of document.querySelectorAll("#keypad button")){
        let d=getDatas(b);
        let t=d.text;
        if(t)res[t]=b;
    }
    return res;
}

