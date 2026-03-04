#!run

export async function main(){
  return [...this.glob("*.js")].map(f=>this.resolve(f).truncExt());
}