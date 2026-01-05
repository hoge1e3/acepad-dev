self.addUrlHandler("app",(event)=>{
  const {request}=event;
  const {url}=request;
  const blob=new Blob([
    `${Math.random()}<br>
    <a href="${url}">${url}</a>
    `
  ],{
    "type":"text/html"
  });
  //self.mesrc.postMessage();
  
  return new Response(blob, {
    headers: {
      "Content-Type": blob.type || "text/json",
      "Content-Length": blob.size
    }});
});
{res:51};