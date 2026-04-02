#!run
import {SFile} from "@hoge1e3/sfile";
interface Shell{
  resolve(p:string):SFile;
}
export async function main(
  this:Shell,js:string){
  const mapf=this.resolve(js+".map");
  const jsf=this.resolve(js)
  let jss=jsf.text();
  jss=jss.replace(
    /(#\s*sourceMappingURL=)(.*)/,
    (m,h,t)=>`${h}${mapf.dataURL()}`
    )
  //jsf.text(jss);
  return jss;
}
