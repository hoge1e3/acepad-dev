#!run
import {showWidget} from "@acepad/widget";
export async function main(){
    const w=showWidget();
    const acepad=this.$acepad;
    const editor=acepad.input();
    console.log("edt",editor,editor.element);
    w.element.appendChild(editor.container);
    editor.session.setValue("aaaa");
    this.echo("(press F1 to switch this session).");
}
