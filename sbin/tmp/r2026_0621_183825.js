#!run
import {ref} from "@hoge1e3/ref";
import {Idb} from "./idb.js"
import {t} from "@hoge1e3/dom";
import {romajiToKatakanaAdvanced} from "@hoge1e3/roma";
export async function main(){
   const kdic=await Idb.create("kdic","k2k");

  const editor=this.$acepad.getMainEditor();
  const c=editor.container;
  const re=ref("r");
  function put(sur,del){
    const session=editor.session;
    const r=session.getSelection().getRange();
    r.start.column-=del;
    session.getSelection().setRange(r);
    editor.onTextInput(sur);
    editor.focus();
  }
  editor.renderer.on("afterRender", 
  async() => {
   try{
      const session=editor.session;
      const r=session.getSelection().getRange().start;
      const i=session.doc.positionToIndex(r);
      const rt={
        column:0,
        row:r.row
      };
      const it=session.doc.positionToIndex(rt);
      let value=session.getValue();
      if(!inNaturalLang(value,i)){
        re.value=t.div();
      return;
      }
      let line= value.
        substring(it,i);
      let nohirac=false;
      const lasta=/[\w\-]+$/.exec(line);
      if(lasta)line=lasta[0];
      else nohirac=true;
      const h=await getCands(romajiToKatakanaAdvanced(
      line),line,nohirac);
      console.log(h)
      re.value=t.div(...h.map(e=>
        t.button({
          style:`border: 1px solid black; padding: 5px;`,
          onclick:()=>put(e.surface,e.delLen),
        },`${e.surface}`)
      ));
      return ;
      if(!h){
        re.value="";
        return ;
      }
      const ke=(await kdic.get(h));
      re.value=ke?ke.map(
        (e)=>e.surface).join(","):h;
      
    }catch(e){
      re.value=e;
      return e;
    }
  });
  re.on("change",({val})=>{
    console.log(val);
  });
  "自動的に変換";
// 日本語っぽい string
  return this.watch(re);
  async function getCands(k,orig,nohirac){
    let buf="",kanas=[],c=[];
    for(let j=k.length-1;
    j>=0;j--){
      const {s,i}=k[j];
      if(!/[\u3041-\u3096ー]+$/
      .exec(s))break;
      buf=s+buf;
      kanas.push({kana:buf,delLen:orig.length-i});
    }
    kanas.reverse();
    let max=10;
    for(let {kana,delLen} of kanas){
      const ke=(await kdic.get(kana));
      if(!nohirac)c.push({surface:kana,delLen});
      if (!ke) continue;
      for (let kee of ke) {
        c.push({surface:kee.surface,delLen});
        if (max--<=0) break;
      }
      if (max<=0) break;
    }
    return c;
  }

}
function getHiragana(s){
  const m=/[\u3041-\u3096ー]+$/.exec(s);
  return m&&m[0];
}
function inNaturalLang(s, pos) {
  //jsのソースsのpos文字目は
  //コメントまたは文字列リテラル内か
  let i = 0;
  let state = "code"; // "code" | "sq" | "dq" | "tpl" | "line" | "block"
  while (i < pos && i < s.length) {
    const c = s[i];
    const c2 = s[i + 1];
    if (state === "code") {
      if (c === "/" && c2 === "/") { state = "line"; i += 2; continue; }
      if (c === "/" && c2 === "*") { state = "block"; i += 2; continue; }
      if (c === "'") { state = "sq"; i++; continue; }
      if (c === '"') { state = "dq"; i++; continue; }
      if (c === "`") { state = "tpl"; i++; continue; }
      i++;
    } else if (state === "line") {
      if (c === "\n") state = "code";
      i++;
    } else if (state === "block") {
      if (c === "*" && c2 === "/") { state = "code"; i += 2; continue; }
      i++;
    } else if (state === "sq" || state === "dq" || state === "tpl") {
      if (c === "\\") { i += 2; continue; } // escape
      if ((state === "sq" && c === "'") ||
          (state === "dq" && c === '"') ||
          (state === "tpl" && c === "`")) {
        state = "code";
      }
      i++;
    }
  }
  return state !== "code";
}/*
生成aiにpuronputo
select文
書き込む
日本語が入力できた
凄いにゃあ
いくつかの候補から 
選択できる
getHiraganaを改造して
増加すると
*/