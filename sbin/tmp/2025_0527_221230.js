#!run
import {show} from "@acepad/widget"
export async function main(){
const h=`<button type="button" commandfor="my-dialog" command="show-modal">
  モーダルを開く
</button>

<dialog
  id="my-dialog"
  closedby="any"
  aria-labelledby="my-dialog-heading"
  autofocus
>
  <h1 id="my-dialog-heading">Heading</h1>
  <p>Content</p>
  <button type="button" commandfor="my-dialog" command="close">閉じる</button>
</dialog>`;


const w=show();
w.element.innerHTML=h;
}