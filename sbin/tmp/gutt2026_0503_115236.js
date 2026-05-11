#!run
import {t} from "@hoge1e3/dom";
export async function main(){
  const editor=this.$acepad.getMainEditor();
  const c=editor.container;
  const session=editor.session;
  const ml=c.querySelector(".ace_marker-layer");
  const sc=c.querySelector(".ace_scroller");
  const tl=c.querySelector(".ace_text-layer");
  //sc.appendChild(
  const a={
    row:3,column:0
  };
  const lines=[];
  const rect=
  editor.container.getBoundingClientRect();
  //const annotations = editor.getSession().getAnnotations();
  //return annotations  
  //return [tct,tcb];
  editor.renderer.on("afterRender", () => {
    const sz=editor.getFontSize();
    const annotations = editor.getSession().getAnnotations();
    const anons=[];
    for(let a of annotations){
      anons[a.row]=a;
    }
    const tct=editor.renderer.
    screenToTextCoordinates(0,rect.y);
    const tcb=editor.renderer.
    screenToTextCoordinates(0,rect.y+rect.height);
    function getFloatPos(s,c=0){
      const lines=s.split("\n");
      return lines.
      //map((s)=>s.substring(c)).
      map((line,ii)=>{
        if(anons[ii])return line.length;
        const i=line.indexOf(
          " ".repeat(((ii+1)+"").length),c);
        if(i<0)return line.length;
        return i;
      });
    }
    const cols=getFloatPos(
      editor.session.getValue(),tct.column);
    for(let r=tct.row;r<=tcb.row;r++){
      const screenPos = 
        editor.renderer.
        textToScreenCoordinates(
        r, cols[r]);
      const me=lines[r]|| t.span(
        {style:`
        position:absolute;
        left:100px;
        top:100px;
        margin:0px;
        padding:0px;
        z-index:300001;
        opacity:0.6;
        color: #f80;
        vertical-align:top;
        border: 0px solid yellow;
        //background-color:#ddd;
        `},
      );
      lines[r]=me;

      const el=me;
      el.innerText=anons[r]?anons[r].text:
        ""+(r+1);
      el.style.height=sz+"px";
      el.style["line-height"]=sz+"px";
      el.style["font-size"]=sz+"px";
      el.style.position = "absolute";
      el.style.left = screenPos.pageX  + "px"; // 余白に出す
      el.style.top = screenPos.pageY + "px";
    
      document.body.appendChild(me);
    }
    for(let i in lines){
      if(lines[i]&&
      (i<tct.row||i>tcb.row)){
        document.body.removeChild(lines[i]);
        lines[i]=null;
      }
    }
  }
  );
  return ;
  addw(editor);
  return ;
    const marker = session.addDynamicMarker({
      update(html, markerLayer, 
    session, config){
      // console.log(markerLayer)
        //markerLayer.element.
        ml.appendChild(me);
        //  marker.markerElement=me
        }
      }, true);
    
      //return [ml,tl];
    }
    function addw(editor){
      const lineWidgets = editor.session.widgetManager;
    
    lineWidgets.addLineWidget({
      row: 3,
      fixedWidth: true,
      el: (() => {
        const el = document.createElement("div");
        el.className = "my-error-widget";
        el.textContent = "Unexpected token";
        return el;
      })()
    });
    }
    //p9=3;
    function addw2(editor){
      editor.renderer.on("afterRender", () => {
      const annotations = editor.getSession().getAnnotations();
    
      annotations.forEach(a => {
        const screenPos = editor.renderer.textToScreenCoordinates(a.row, a.column);
      
        const el = document.createElement("div");
        el.className = "inline-error";
        el.textContent = a.text;
      
        el.style.position = "absolute";
        el.style.left = screenPos.pageX + 50 + "px"; // 余白に出す
        el.style.top = screenPos.pageY + "px";
      
        document.body.appendChild(el);
      });
    });
}
