# Acepad
Node.js-like Programming Environment for Web Browser/Smartphones.

## If you are reading this on GitHub
Go to [demo site](https://hoge1e3.github.io/acepad/):
- select 'petit-node'.
- select 'Install/Rescue'.
- At first time, Select either 'Use physical keyboard' or 'Use screen keyboard'.
- At next visit, you can also launch via shortcut icon 'home'

## Recent File or Directory List
- Press F1 (function keys at the right side of the editor) to open the list  
   - It automatically opens the first time Acepad starts. 
- Use arrow keys to select items and press the 'Ent' key (Enter key) to open them.
- Unopened files/dirs are shown with full paths, and opened files/dirs are shown with short names.

## Directory List
- Lists files in the directory.
- Use arrow keys to select items and press the 'Ent' key to open them.
- Type a file name after `new:` and press 'Ent' to create the file. (To create a directory, the name must end with a slash, e.g. `user/`.)
- Type a shell command after `sh:` and press 'Ent' to execute it (see [Shell commands](#shell-commands)).
- Every line can be edited, and if it looks like a shell command, it will be executed when 'Ent' is pressed.  
- Press F6 to refresh (reload).
- Press F7 to open the parent directory.

## File Editing
- Select (press 'Ent') a regular file in the Directory List to edit it.
- If a file is edited, it is automatically saved.
- Press F5 to run the program:
   - If the file is a JavaScript (`*.js`) file and the first line begins with `#!run`, the file is executed by calling the exported `main` function. The `main` function is called with `this` bound to the 'Shell object' (see [Shell commands](#shell-commands)). 
   - If the file is inside an npm package (i.e. has a `package.json` in an ancestor directory), the script in the `scripts.test` field is run.

## Keyboard Operation
- Use the on-screen keyboard to type and edit.
   - A physical keyboard can also be used if present. 
- The on-screen keyboard has two modes depending on the screen width: 
   - **Narrow mode**
     - Default on regular smartphones
     - To input symbols, use the 'SYM' key at the top right.  
   - **Wide mode**
     - Appears on wide-screen devices (e.g. foldables or tablets)
     - Symbol keys are displayed as green keys.
- Modifier keys (Ctrl, Shift) are toggle-style:
   - Instead of holding down Ctrl, tap it and then press any letter or number. For example, to perform Ctrl+X, tap Ctrl (without holding) and then press X. 
   - The Shift key works the same way. Unlike Ctrl, tapping it twice locks it, so all subsequent keys act as if Shift were held down. A single tap only applies to the next key.
- Pressing Shift+Arrow enters selection mode: 
   - Arrow keys extend the selected range.  
   - Press 'Sel' to clear the selection.  
   - The 'genAI' key generates an AI prompt to fill in the currently selected code fragment.  
   - The 'fixAI' key generates an AI prompt to modify or fix the currently selected code fragment.  
   - Press 'Quit' to exit selection mode.

## Shell Commands
- Regular Unix-like commands are available: `echo`, `ls`, `cp`, `mv`, `rm`, `ln`, `diff`.
- In the Directory List, type `sh: <command>` and press 'Ent' to run `<command>`.  
   - Example: `sh: cp file.txt file2.txt`
- Other frequently used commands include:  
   - `edit <file-or-dir>` → open (edit) the file or directory  
   - `dl <file>` → download the file to local storage  
   - `upload` → upload a file from local storage  
   - `zip <zip-file> <dir>` → create a zip file; if `<dir>` is omitted, download the zip file  
   - `unzip <zip-file> <dir>` → extract a zip file  
   - `newcmd <cmd>` → create a new command and edit it. If `<cmd>` is omitted, it is created in a temporary directory (deleted after about 1 day).  
   - `npm-init <package-name>` → create a new npm package in the nearest `node_modules` directory.  
- The 'Shell object' can be used in `*.js` programs via the `this` object.  
   - The following example is equivalent to running `cp README.md READUS.md` and `rm -r /tmp`:
   ~~~js
   export async function main() {
      await this.cp("README.md", "READUS.md");
      await this.rm({r:true}, "/tmp/");
   }
   ~~~
- See [@acepad/shell](https://www.npmjs.com/package/@acepad/shell) for details.

## List of Function Keys 
Function keys are shown at the right side of the edit area. If the editor text overlaps them, they become opaque.

- F1: List of recently opened files
- F2: Shortcut for `newcmd` (create new script for debugging)
- F3: Search files
- F4: N/A
- F5: Run program
- F6: Refresh directory list
- F7: Open parent directory
- F8: File tree
- F9: N/A
- F10: N/A
- F11: Show console
- F12: Reload (go to first page; the contents of `/tmp` are cleared)

# Sample programs

See /idb/run/samples/
