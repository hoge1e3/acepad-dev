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

const sourceCode = `let x: number = 10;`;
const sourceFile = ts.createSourceFile("example.ts", sourceCode, ts.ScriptTarget.Latest);
ts.forEachChild(sourceFile, node => {
  if (ts.isVariableStatement(node)) {
    console.log("Variable Statement found:", node);
  }
});

// 仮想ファイルシステムクラス
class VirtualFileSystem {
  constructor(fileStructure) {
    this.fileStructure = fileStructure;
  }

  // ファイルの内容を取得
  readFile(fileName) {
    const parts = fileName.split('/').filter(part => part);
    let current = this.fileStructure;

    for (const part of parts) {
      if (typeof current !== 'object' || current === null) {
        return undefined;
      }
      current = current[part];
    }

    return typeof current === 'string' ? current : undefined;
  }

  // ファイルが存在するかチェック
  fileExists(fileName) {
    return this.readFile(fileName) !== undefined;
  }

  // 現在のディレクトリを取得
  getCurrentDirectory() {
    return '/';
  }

  // ディレクトリ一覧を取得
  getDirectories(path) {
    const parts = path.split('/').filter(part => part);
    let current = this.fileStructure;

    for (const part of parts) {
      if (typeof current !== 'object' || current === null) {
        return [];
      }
      current = current[part];
    }

    return Object.keys(current || {}).filter(key => 
      typeof current[key] === 'object'
    );
  }
}

// コンパイル関数
async function compileTypeScript(fileSystem, rootNames, options) {
  // TypeScriptコンパイラを読み込む
const ts = await loadTypeScriptCompiler();

  // カスタムコンパイラホストの作成
  console.log("opt",options);
  const host = ts.createCompilerHost(options);

  // ホストオブジェクトのメソッドをオーバーライド
  host.readFile = fileSystem.readFile.bind(fileSystem);
  host.fileExists = fileSystem.fileExists.bind(fileSystem);
  host.getCurrentDirectory = fileSystem.getCurrentDirectory.bind(fileSystem);
  host.getDirectories = fileSystem.getDirectories.bind(fileSystem);

  // メモリ内の出力マップ
  const outputFiles = new Map();
  host.writeFile = (fileName, contents) => {
    outputFiles.set(fileName, contents);
  };

  // プログラムを作成してコンパイル
  const program = ts.createProgram(rootNames, options, host);
  const emitResult = program.emit();

  // 診断情報を収集
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  return {
    outputFiles: Object.fromEntries(outputFiles),
    diagnostics: allDiagnostics.map(diagnostic => {
      if (diagnostic.file) {
        const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
      } else {
        return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      }
    })
  };
}

// デモ関数
async function runTypeScriptCompilationDemo() {
    const ts = await loadTypeScriptCompiler();

  // サンプルのファイル構造
  const fileStructure = {
    'src': {
      'main.ts': `
        import { greet } from './utils/helper';
        const message: string = "Hello, TypeScript!";
        console.log(message);
        console.log(greet("World"));
      `,
      'utils': {
        'helper.ts': `
          export function greet(name: string): string {
            return \`Hello, \${name}!\`;
          }
        `
      }
    }
  };

  const virtualFileSystem = new VirtualFileSystem(fileStructure);

  const compilerOptions = {
    noEmitOnError: false,
    noImplicitAny: true,
    target: window.ts.ScriptTarget.ES5,
    module: window.ts.ModuleKind.CommonJS
  };

  try {
    const result = await compileTypeScript(
      virtualFileSystem, 
      ['src/main.ts', 'src/utils/helper.ts'], 
      compilerOptions
    );

    // 結果の表示
    console.log('Compilation Output Files:', result.outputFiles);
    
    if (result.diagnostics.length > 0) {
      console.warn('Compilation Diagnostics:', result.diagnostics);
    }

    // コンパイルされたファイルを動的に実行（オプション）
    Object.entries(result.outputFiles).forEach(([fileName, content]) => {
      console.log(`Content of ${fileName}:`, content);
    });
  } catch (error) {
    console.error('Compilation error:', error);
  }
}

// デモの実行
export function main(){
runTypeScriptCompilationDemo();
    
}
/*
const program = ts.createProgram(options.fileNames, options.options, host);

Passing a custom implementation of CompilerHost to createProgram fixed it for me (without one, TS tries to use ts.sys defaults, which is unavailable in browsers).
https://github.com/microsoft/TypeScript/issues/35903

const compilerHost = {
            getSourceFile: ...,
            getDefaultLibFileName: ...,
            writeFile: ...,
            getCurrentDirectory: ...,
            getDirectories: ...,
            getCanonicalFileName: ...,
            getNewLine: ...,
            useCaseSensitiveFileNames: ...,
            fileExists: ...,
            readFile: ...,
};
*/