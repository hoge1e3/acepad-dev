#!run
import {produce} from "immer";
export async function main(){
  const o={a:3}
  const o2= produce(o,draft=>{
  draft.a++
    
  });;
  return [o,o2,o===o2]
}