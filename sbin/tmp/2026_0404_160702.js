#!run
import {ref,V,E} from "@hoge1e3/ref";

export async function main(){
  return this.widget({
    wmain,
    css: "test.css"
  });
}
function wmain({id,r,c,t,set}){
  const cnt=r(0);
  return c(id,cnt,(cv)=>
    t.div(
      t.div("c=",cv),
    t.button({
      onclick(){
        set(cnt,cv+1);
      }
    },"+"))
  );
}