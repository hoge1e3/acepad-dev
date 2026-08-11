#!run
import { diffLines } from "diff";
export async function main(){
  console.log(diffLines("a\nA\nQ\nb","a\nA\nc\nb"));
  return ;
}