#!run
import {Tonyu} from "tonyu2-runtime";
import {showWidget} from "@acepad/widget";
import {t} from "@hoge1e3/dom";
import "/idb/run/samples/tonyu/Actest/js/concat.js";
const raf=()=>new Promise(requestAnimationFrame); 
export async function main(){
  let cv=t.canvas();
  let wid=showWidget();
  const e=wid.element;
  const rect=e.getBoundingClientRect();
  cv.setAttribute("width",rect.width);
  cv.setAttribute("height",rect.height);
  wid.element.appendChild(cv);
  let g=Tonyu.globals;
  const sh=this;
  sh.cd("/idb/run/samples/tonyu/Actest/js/concat.js");
  g.$mainCanvas=$(cv);
  g.$shell=this;
  g.$pNode=pNode;
  globalThis.UIDiag={};
  g.$currentProject={
      getResource(){
        const r={
          images:[],sounds:[]
        };
        //console.log("getResource",r);
        return r;
      },
      getOptions:()=>({
          run: {
              mainClass: "user.Main",
          },
      }),
      loadPlugins:(s)=>s(),
      requestPlugin:(s)=>console.log("Plugin", s),
      getDir() {
        return sh.resolve(".");
      }
  };
  globalThis.ImageList={
      load:(_,succ)=>succ({names:[]})
  };
  globalThis.T2MediaLib=class {
    activate(){
    }
  };
  Tonyu.run("kernel.Boot");
  return ;
}
