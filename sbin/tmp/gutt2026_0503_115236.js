#!run
import {t} from "@hoge1e3/dom";
export async function main(){
  const c=this.$acepad.getMainEditor().container;
  const ml=c.querySelector(".ace_marker-layer");
  const sc=c.querySelector(".ace_scroller");
  const tl=c.querySelector(".ace_text-layer");
  sc.appendChild(
    t.span(
      {style:`
      position:absolute;
      left:100px;
      top:100px;
      z-index:99999;
      background-color:red;
      `},
      "engines"
    )
  )
  //return [ml,tl];
}