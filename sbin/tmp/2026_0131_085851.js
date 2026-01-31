#!run

export async function main(){
  this.$acepad.getMainEditor().
  container.addEventListener(
    "touchstart",()=>{
      console.log("touced")
    })
  return ;
}