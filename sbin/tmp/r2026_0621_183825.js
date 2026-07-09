#!run
import {ref} from "@hoge1e3/ref";
import {Idb} from "./idb.js"
import {romajiToKatakanaAdvanced} from "@hoge1e3/roma";
export async function main(){
   const kdic=await Idb.create("kdic","k2k");

    const editor=this.$acepad.getMainEditor();
  const c=editor.container;
  const re=ref("r");
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
      const line= session.getValue().
        substring(it,i);
      const h=await getCands(romajiToKatakanaAdvanced(
      line),line);
      console.log(h)
      re.value=h.map(e=>`${e.surface}${e.delLen}`).join(",");
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
  })
  "jidouteki ni henkan"
// nihongoppoi string
  return this.watch(re);
  async function getCands(k,orig){
    let buf="",kanas=[],c=[];
    for(let j=k.length-1;
    j>=0;j--){
      const {s,i}=k[j];
      if(!/[\u3041-\u3096]+$/
      .exec(s))break;
      buf=s+buf;
      kanas.push({kana:buf,delLen:orig.length-i});
    }
    kanas.reverse();
    let max=10;
    for(let {kana,delLen} of kanas){
      const ke=(await kdic.get(kana));
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
  const m=/[\u3041-\u3096]+$/.exec(s);
  return m&&m[0];
}
/*
kakikomu
ikutukano kouho kara 
sentaku dekiru
getHiragana wo kaizousite
*/