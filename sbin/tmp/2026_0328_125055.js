#!run

export async function main(){
  return isPlainObject(
    this.resolve(import.meta.url));
}
// @hoge1e3/is-plain-object
export default function isPlainObject(o){
    return depth(o)===probed;
}
function depth(o){
    let r=0;
    while(o){
      console.log(o)
        o=Object.getPrototypeOf(o);
        if(r++>10)break; 
    }
    return r;
}
let probed=depth({});