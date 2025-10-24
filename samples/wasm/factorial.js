#!run
import {watToModule} from "./wabt.js";
export async function main(){
  //https://webassembly.github.io/wabt/demo/wat2wasm/index.html
  const {fac}=await watToModule(`
(module
  (func $fac (export "fac") (param f64) (result f64)
    local.get 0
    f64.const 1
    f64.lt
    if (result f64)
      f64.const 1
    else
      local.get 0
      local.get 0
      f64.const 1
      f64.sub
      call $fac
      f64.mul
    end))

`);
  for (let i = 1; i <= 15; i++) {
    this.echo(fac(i));
  }
}