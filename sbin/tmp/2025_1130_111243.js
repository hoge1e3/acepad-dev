#!run
import * as p from "pnode:main";
export async function main(){
  this.echo(`import * as p from "pnode:main";`);
  for (let i in p){
    if (i=="default") {
      this.echo(`export default p.default;`);
    }else{
      this.echo(`export const ${i}=p.${i};`);
      
    }
  }
}