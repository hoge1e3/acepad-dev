//require "dep.js"
export function showIframe(url){
    let e=$("<iframe>").attr({
        src:url
    });
    let cont=$("<div>").append(e);
    let r=showWidget(cont);
    r.iframe=e[0];
    r.go=(url)=>{
            e.attr({src:url});
        };
    return r;
}
export function showWidget(e){
    e=$(e);
    e.addClass("widget");
    let cl=$("<button>").text("x").
    addClass("widget-close").click(close);
    $("#editor").after(e);
    $("#editor").after(cl);
    function close(){
        e.remove();
        cl.remove();
    }
    return {
        element:e[0],
        closeButton:cl,
        close,
    };
}
