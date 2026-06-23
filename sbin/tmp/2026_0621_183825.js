#!run
import * as r from "@hoge1e3/roma";
export async function main(){
    const editor=this.$acepad.getMainEditor();
  const c=editor.container;
  const session=editor.session;

  return this.watch(()=>{
    try{
      const r=session.getSelection().getRange().start;
      const i=session.doc.positionToIndex(r);
      const rt={
        column:0,
        row:r.row
      }
      const it=session.doc.positionToIndex(rt);
      const line= session.getValue().
      substring(it,i)
      
    }catch(e){
      return e;
    }
    });
}