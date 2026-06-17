#!run

export async function main(){
  return this.widget({wmain});
}
function wmain({print,w,t}){
   return t.div(
     t.h1("test"),
     i(t)
  );
}
function i(t){
  const f=t.iframe({
       border:1,
       width:200,
       height:200,
       style:`
       width:90%;
       height:90%;
       
       `,
       srcdoc:`
    <body bgcolor="cyan">
    <h1>test</h1>
    <h1>test</h1>
    </body>
       
  `
     });
  setTimeout(()=>{
    return;
  const w=f.contentWindow;
    w.document.body.addEventListener(
    "touchstart",(e)=>{
      e.stopPropagation();
      e.preventDefault();
      console.log(e);
    }  
    );

    w.document.body.addEventListener(
    "touchmove",(e)=>{
      e.stopPropagation();
      e.preventDefault();
      console.log(e);
    }  
    );
  },100);
  return f;
}