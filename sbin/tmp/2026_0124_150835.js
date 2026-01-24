#!run
import {file} from "@acepad/here";
export function main(){
  // get File object for this file
  const f=file(import.meta.url);
  let x=4;// increases by pressing F5
  const text_content=f.text();
  const new_content=text_content.replace(/x=\d+/,`x=${x+1}`);
  f.text(new_content);
}