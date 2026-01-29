#!run

export async function main(){
  const f=this.resolve("test.txt");
  
  //f.text("a\r\nc");
  return JSON.stringify(f.text());
}