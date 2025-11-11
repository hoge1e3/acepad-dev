#!run
import {watToModule} from "./wabt.js";
export async function main(){
  //https://webassembly.github.io/wabt/demo/wat2wasm/index.html
  const {addTwo}=await watToModule(`(module
  (func (export "addTwo") (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add))
`);
  return addTwo(2,3);
}