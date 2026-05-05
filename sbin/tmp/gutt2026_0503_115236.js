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