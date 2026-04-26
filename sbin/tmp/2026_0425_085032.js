#!run

export async function main(){
  const el=this.$acepad.
  getMainEditor().
  container;
  const ml=el.
  querySelector(".ace_marker-layer")
  
  return ml;
}