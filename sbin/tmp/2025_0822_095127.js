#!run
import {t} from "@hoge1e3/dom";
export async function main(){
const i=t.iframe();

document.body.appendChild(i);
const w=i.contentWindow;
const f=new w.Function (`
return globalThis;
`);
const fw=f();
this.echo(fw===window, fw===w);
await this.sleep(1);

document.body.removeChild(i);
}