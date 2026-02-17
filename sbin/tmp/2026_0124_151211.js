#!run
import {filePath} from "@acepad/here";
export async function main(){
  return filePath(import.meta.url);
}