#!run
import { diffLines } from "diff";

export async function main(){
 return  diffLines(
    this.resolve("2026_0807_212557.js").text(),
    this.resolve("2026_0807_100310.js").text(),
);
return ;
}
