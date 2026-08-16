#!run

export async function main(){
  this.$acepad.getMainEditor().
  session.setMode("ace/mode/tonyu");
  return ;
}