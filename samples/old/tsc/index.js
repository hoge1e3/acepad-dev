#!run 
// ブラウザ環境用のTypeScript仮想ファイルシステムとコンパイラ
import {p} from "@hoge1e3/polyfiller";
// TypeScriptコンパイラをCDNから読み込むためのスクリプトタグを動的に追加
function loadTypeScriptCompiler() {
  return new Promise((resolve, reject) => {
    if (window.ts) {
      resolve(window.ts);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/typescript/5.3.2/typescript.js';
    script.onload = () => resolve(window.ts);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

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
  const dir="/jsmod/sample/tsc/";
  const host = p("host1231283721",{
      "resolveModuleNameLiterals": p("0.18793379405229804",{
      }),
      "hasInvalidatedResolutions": p("0.2832245551874659",{
      }),
      "getCurrentDirectory": ()=>dir,
      "getDefaultLibLocation": ()=>dir,
      "trace": p("0.8895635217621469",{
      }),
      "onUnRecoverableConfigFileDiagnostic": p("0.5338845565487913",{
      }),
      "useCaseSensitiveFileNames": ()=>true,
      "realpath": p("0.18934700024567053",{
          "bind": p("0.5747861134426278",()=>{
              return p("3223bbbb8312",{
                  
              });
          }),
      }),
      "getDirectories": p("0.7157485895779427",{
          "bind": p("0.13491815393519468",()=>{
              return p("3223aaa8312",{
                  
              });
          }),
      }),
      "directoryExists": p("0.30892341846040927",{
          "bind": p("0.04478727945477101",()=>{
              return p("328312",{
                  
              });
          }),
      }),
  });//ts.createCompilerHost(options);

  /* ホストオブジェクトのメソッドをオーバーライド
  host.readFile = fileSystem.readFile.bind(fileSystem);
  host.fileExists = fileSystem.fileExists.bind(fileSystem);
  host.getCurrentDirectory = fileSystem.getCurrentDirectory.bind(fileSystem);
  host.getDirectories = fileSystem.getDirectories.bind(fileSystem);
*/
  // メモリ内の出力マップ
  const outputFiles = new Map();
  /*host.writeFile = (fileName, contents) => {
    outputFiles.set(fileName, contents);
  };*/

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

export interface System {
    args: string[];
    newLine: string;
    useCaseSensitiveFileNames: boolean;
    write(s: string): void;
    writeOutputIsTTY?(): boolean;
    getWidthOfTerminal?(): number;
    readFile(path: string, encoding?: string): string | undefined;
    getFileSize?(path: string): number;
    writeFile(path: string, data: string, writeByteOrderMark?: boolean): void;

    watchFile?(path: string, callback: FileWatcherCallback, pollingInterval?: number, options?: WatchOptions): FileWatcher;
    watchDirectory?(path: string, callback: DirectoryWatcherCallback, recursive?: boolean, options?: WatchOptions): FileWatcher;
    @internal
    preferNonRecursiveWatch?: boolean;
    resolvePath(path: string): string;
    fileExists(path: string): boolean;
    directoryExists(path: string): boolean;
    createDirectory(path: string): void;
    getExecutingFilePath(): string;
    getCurrentDirectory(): string;
    getDirectories(path: string): string[];
    readDirectory(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[];
    getModifiedTime?(path: string): Date | undefined;
    setModifiedTime?(path: string, time: Date): void;
    deleteFile?(path: string): void;
    // A good implementation is node.js' `crypto.createHash`. (https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm)
    createHash?(data: string): string;
    // This must be cryptographically secure. Only implement this method using `crypto.createHash("sha256")`.
    createSHA256Hash?(data: string): string;
    getMemoryUsage?(): number;
    exit(exitCode?: number): void;
    //@internal
    enableCPUProfiler?(path: string, continuation: () => void): boolean;
    //@internal
    disableCPUProfiler?(continuation: () => void): boolean;
    //@internal
    cpuProfilingEnabled?(): boolean;
    realpath?(path: string): string;
    //@internal
    getEnvironmentVariable(name: string): string;
    //@internal
    tryEnableSourceMapsForHost?(): void;
    //@internal
    getAccessibleFileSystemEntries?(path: string): FileSystemEntries;
    //@internal
    debugMode?: boolean;
    setTimeout?(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
    clearTimeout?(timeoutId: any): void;
    clearScreen?(): void;
    //@internal
    setBlocking?(): void;
    base64decode?(input: string): string;
    base64encode?(input: string): string;
    //@internal
    require?(baseDir: string, moduleName: string): ModuleImportResult;
    // For testing
    //@internal
    now?(): Date;
    //@internal
    storeSignatureInfo?: boolean;
}
*/