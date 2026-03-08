#!run
import {openFile} from "@acepad/files";

export async function main() {
    // Open a file in the current directory
    await openFile(this, "myfile.js");
    
  /*  // Open a file with specific cursor position
    await openFile(this, "config.json", {row: 10, column: 5});
    
    // Open a directory (shows directory listing)
    await openFile(this, "./mydir/");*/
}