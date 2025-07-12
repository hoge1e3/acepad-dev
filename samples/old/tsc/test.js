#!run 
// ブラウザ環境用のTypeScript仮想ファイルシステムとコンパイラ

// TypeScriptコンパイラをCDNから読み込むためのスクリプトタグを動的に追加
function loadTypeScriptCompiler() {
  return new Promise((resolve, reject) => {
    if (window.ts) {
      resolve(window.ts);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/typescript/5.3.2/typescript.min.js';
    script.onload = () => resolve(window.ts);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
export async function main(){
    for(let k in localStorage){
        if(k.match(/^\/tmp/)){
            this.echo(k);
            delete localStorage[k];
        }
    }
    return ;
const ts=await loadTypeScriptCompiler();

const sourceCode = `function greet() { console.log("Hello, world!"); }`;
const sourceFile = ts.createSourceFile("example.ts", sourceCode, ts.ScriptTarget.Latest);
const program = ts.createProgram(["example.ts"], {});
//const checker
console.log(sourceFile);
ts.forEachChild(sourceFile, node => {
  if (ts.isVariableDeclaration(node)) {
    const type = checker.getTypeAtLocation(node);
    console.log("Type:", checker.typeToString(type));
  }
});
/*
const sourceCode = `let x: number = 10;`;
const sourceFile = ts.createSourceFile("example.ts", sourceCode, ts.ScriptTarget.Latest);
ts.forEachChild(sourceFile, node => {
  if (ts.isVariableStatement(node)) {
    console.log("Variable Statement found:", node);
  }
});*/
}