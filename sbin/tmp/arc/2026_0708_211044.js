#!run
import {ref,computed} from "@hoge1e3/ref";
import {t} from "@hoge1e3/dom";
export async function main(){
  const c=ref(0);
  return this.watch(
    computed(c,(v)=>
        t.div(
          v,
          t.button({
            style:`
            padding: 10px;
            `,
            onclick:()=>
              c.value+=1
          },"+")
        )
  ));
}