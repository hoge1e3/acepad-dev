#!run

export async function main(){
const e=this.$acepad.getMainEditor();
e.commands.addCommand({
  name:"a",bindKey:"ctrl-r",exec(){
    alert("a");
  }
});/*
e.commands.addCommand({
  name:"b",bindKey:"ctrl-r",exec(){
    alert("b");
  }
});
*/
}