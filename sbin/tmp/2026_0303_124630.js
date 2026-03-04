#!run

export async function main(){
  return this.resolve(
    import.meta.url).
    dataURL();
}