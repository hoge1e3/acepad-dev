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
  const me=  t.span(
      {style:`
      position:absolute;
      left:100px;
      top:100px;
      z-index:99999;
      background-color:red;
      `},
      "engines"
    );
    const a={
      row:3,column:0
    }
    editor.renderer.on("afterRender", () => {
      const screenPos = editor.
      renderer.
      textToScreenCoordinates(
        a.row, a.column);
     const el=me;
       el.style.position = "absolute";
    el.style.left = screenPos.pageX + 50 + "px"; // 余白に出す
    el.style.top = screenPos.pageY + "px";
 
  document.body.appendChild(me);
    
    });
    return ;
  addw(editor)
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