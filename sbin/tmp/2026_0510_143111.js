#!run

export async function main(){
    const editor=this.$acepad.getMainEditor();

  return editor.getFontSize();
}