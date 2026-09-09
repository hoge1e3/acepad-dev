#!run
const url="https://hoge1e3.github.io/acepad/index.html?autostart=[&quot;home&quot;,&quot;Install/Rescue&quot;]";
export async function main() {
    const command="mob";//getQueryString("command");
    if (command) {
      const w=await this.webpage(url,{
        fullscreen:1
      });
        const iframe=w.iframe;//document.querySelector("#run");
        let received=false,ready=false;
        addEventListener("message",async (e)=>{
            console.log("recv",e, e.data);
            if (e.data.result==="ab"&&
            !ready) {
                ready=true;
                await iframe.contentWindow.postMessage(
                    {type:"shell",command},
                    {targetOrigin:"https://hoge1e3.github.io"});
            }
        });
        while(!ready&&
        !!iframe.contentWindow) {
            //console.log("send!",hash);
            await iframe.contentWindow.postMessage(
                {type:"shell",command:"strcat a b"},
                {targetOrigin:"https://hoge1e3.github.io"});
            await new Promise(s=>setTimeout(s,16));
        }
    }
}  
//main().then((s)=>0,(e)=>alert(e.stack));
function getQueryString(key, default_="") {
    if (arguments.length === 1) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(location.href);
    if (qs == null) return default_;
    else return decodeURLComponentEx(qs[1]);
}
function decodeURLComponentEx(s) {
    return decodeURIComponent(s.replace(/\+/g, '%20'));
}


   