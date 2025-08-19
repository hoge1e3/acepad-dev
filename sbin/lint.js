#!run
import * as espree from "espree";
export async function main(){
  const editor=this.$acepad.editor;
  const sourceCode=editor.getValue();//.text();
    let ast;
    ast = espree.parse(sourceCode, {
      sourceType: 'module',
      loc: true,
      range: true,
      ecmaVersion: 2024,
    });
    console.log(ast);
    
  editor.session.setAnnotations([
    {
      row:6,column:5,text:"kesikaran",
      type:"error",
    } ,
    {
      row:7,column:5,text:"zettaiakan",
      type:"warning",
    } ,
    
  ]);

}