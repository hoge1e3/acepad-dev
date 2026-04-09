#!run

export async function main(){
  return this.widget(
    {
      css:"test.css",
      wmain({t}){
        return t.div("aaa")
      }
    });
}