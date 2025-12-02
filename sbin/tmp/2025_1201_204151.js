#!run

export async function main(){
  const r=this.$acepad.getMainEditor().renderer;
  const c=r.container;
  this.watch(()=>{
    const p=[r.getScrollLeft(), r.getScrollTop()];
    return p[0];
  });
  return ;
}