#!run

import {loadScriptTag} from "@hoge1e3/loadScript";
/* global WebAssembly*/
async function loadLib(){
  if (!globalThis.WabtModule) {
      await loadScriptTag("https://webassembly.github.io/wabt/demo/libwabt.js");
  }
  return globalThis.WabtModule;
}
async function loadWabt(){
  const WabtModule=await loadLib();
  return await WabtModule();
}

export async function watToModule(wat,_features={}) {
    const wabt=await loadWabt();
    function compile(wat) {
        const features={...wabt.FEATURES,_features};
        const module = wabt.parseWat('test.wat', wat, features);
        module.resolveNames();
        module.validate(features);
        console.log("features", features);
        const binaryOutput = module.toBinary({log: true, write_debug_names:true});
        console.log(binaryOutput.log);
        const binaryBuffer=binaryOutput.buffer;
        let wasmModule = new WebAssembly.Module(binaryBuffer);
        const wasmInstance = new WebAssembly.Instance(wasmModule, {});
        return wasmInstance.exports;
    }
    return compile(wat);
}
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