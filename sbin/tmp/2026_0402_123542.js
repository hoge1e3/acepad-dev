#!run
import {show} from "@acepad/widget";
import {t} from "@hoge1e3/dom";
export async function main(){
  const w=show({overlay:true});;
  w.print(t.div(
    t.textarea(),t.input()));
}