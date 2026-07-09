#!run
import * as difflib from "difflib";
export async function main(){
  console.log("d",difflib);
  return difflib.SequenceMatcher;
}