#!run
export function main(){
  const f=this.resolve(import.meta.url);
  let x=29;// increases by pressing F5
  f.text(f.text().replace(/x=\d+/,`x=${x+1}`));
}