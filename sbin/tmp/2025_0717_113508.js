#!run

export async function main(){
  const a=this.$acepad;
  const s=this.$acepad.createSession({
     name: "hoge",
    text:"aaa",
    commands:{
      F3(){
        a.print("abc");
      }
    }
  });
  this.$acepad.getMainEditor().setSession(s);
}