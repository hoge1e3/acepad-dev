#!run

export async function main(){
  return this.$acepad.getMainEditor().
  setWrapBehavioursEnabled(true);
}