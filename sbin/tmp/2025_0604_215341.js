#!run

export async function main(){
 const sh=this;
 const lln=12;
 const f=this.resolve("/jsmod/todo.txt");
            sh.edit(f,{row:lln,nomin:1});

}