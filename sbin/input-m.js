import {activate} from "@acepad/overlay";
async function loadAce(){
  if(globalThis.ace)return ;
  const url="https://cdn.jsdelivr.net/npm/ace-builds@1.39.0/src-noconflict/ace.js";
  await import(url);
}
async function main(){
  await loadAce();
  activate(acepad,document.body,{dynamic:true});
}
main();