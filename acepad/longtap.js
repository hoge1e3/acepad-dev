export function showTip(e) {
    let tip=document.querySelector("#tip");
    //console.log(e);
    const b=e.currentTarget;
    if (e.changedTouches) {
        e=e.changedTouches[0];
    }
    const r=b.getBoundingClientRect();
    const rt=tip.getBoundingClientRect();
    //console.log(r);
    tip.setAttribute("style",
    `display:inline;
    left:${r.left}px;
    height:${r.height}px;
    width:${r.width}px;
    top:${r.top-r.height}px;`);
    tip.innerText=b.innerText;
}
export function hideTip(b){
    $("#tip").hide();
}
export function setLongtap(b,handlers){
    let artimer;
    let dolong=handlers.longtap||
    handlers.autorepeat;
    const clearAR=()=>{
        clearTimeout(artimer);
        clearInterval(artimer);
    };
    for(let k of [
        "start","end",
        "longtap"]){
        handlers[k]=handlers[k]||
        function (){};
    }
    if(handlers.autorepeat&&
    typeof handlers.autorepeat!="function"){
        handlers.autorepeat=handlers.start;
    }

    const start=(e)=>{
        showTip(e);
        handlers.start(e);
        e.preventDefault();
        clearAR();
        if(dolong){
        artimer=setTimeout(long,300);
        }
    };
    const long=(e)=>{
        handlers.longtap(e);
        clearAR();
        if(handlers.autorepeat)
        artimer=setInterval(()=>{
            handlers.autorepeat({
                currentTarget:b
            });
        },30);
    };
    const end=(e)=>{
        hideTip(e);
        clearAR();
        handlers.end({
            currentTarget:b
        });
    };
    b.addEventListener("mousedown", start);
    b.addEventListener("touchstart", start);
    b.addEventListener("mouseup", end);
    b.addEventListener("mouseleave", end);
    b.addEventListener("touchend", end);

}