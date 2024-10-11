
export async function main(url,dest){
      let r=await fetch(url);
      let b=await r.blob();
      this.resolve(dest).setBlob(b);
      return dest;
}