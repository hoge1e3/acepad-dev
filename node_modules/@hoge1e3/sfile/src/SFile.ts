
import { DropArgument } from "node:net";
import { default as Content } from "./Content.js";
import {MIMETypes,defaultMIMETYpes} from "./MIMETypes.js";
export { default as Content } from "./Content.js";
import * as assert from "node:assert";
type DependencyContainer={
  fs: typeof import("node:fs"),
  path: typeof import("node:path"),
  Buffer: typeof Buffer,
}
export type MetaInfo={
  lastUpdate:number,
  link?: string,
};

export type ExcludeFunction=(f:SFile)=>boolean;
export type ExcludeHash={[key:string]: any};
export type ExcludeOption=(ExcludeFunction | string[] | ExcludeHash);
export type DirectoryOptions={excludes?: ExcludeOption, excludesF?:ExcludeFunction, includeDir?:boolean};
export type GetDirTreeExcludeFunction=(f:SFile, options:GetDirTreeExcludeFunctionArgs)=>boolean;
export type GetDirStyle = "flat-absolute" | "flat-relative" | "hierarchical" | "no-recursive";
export type GetDirTreeOptions={excludes?: ExcludeOption|GetDirTreeExcludeFunction , style:GetDirStyle, base?:SFile};
export type GetDirTreeExcludeFunctionArgs={fullPath:string, relPath:string, style:GetDirStyle};
export type FileCallback=(f:SFile)=>any;
export class FileSystemFactory {
  mimeTypes: MIMETypes=defaultMIMETYpes;
  constructor(public deps: DependencyContainer) {
      Content.setBufferPolyfill(deps.Buffer);
  }
  addMIMEType(extension:string, contentType:string) {
    this.mimeTypes[extension]=contentType;
  }
  _normalizePath(inputPath:string) {
    // Normalize path to use forward slashes and resolve to absolute path
    if (inputPath.startsWith("file://")) {
      /*
       Windows:  file:///C:/folder/file.txt  -> C:/folder/file.txt
       Unix/Linux: file:///home/user/file.txt -> /home/user/file.txt
      */
      inputPath=inputPath.substring("file://".length);
      if (inputPath.match(/^\/[a-zA-Z]:/)) {
        inputPath=inputPath.substring(1);
      }
    }
    return (
      this.deps.path.
        resolve(inputPath).
        replace(/\\/g,"/")
	  +(inputPath.match(/[\/\\]$/)?
	      "/":"")
	).replace(/\/+/g,"/");
  }
  get(inputPath:string) {
    const normalizedPath = this._normalizePath(inputPath);
    return new SFile(this, normalizedPath);
  }
}
export type Policy={
  topDir: SFile;
}
export type DirTree = { [key: string]: MetaInfo | DirTree };

export class SFile {
  #path:string;
  readonly _path:string;// Just debug info
  #fs:FileSystemFactory;
  #policy: Policy|undefined;
  constructor(__fs:FileSystemFactory, filePath:string, policy?: Policy) {
    this.#fs=__fs;
    this.#path = __fs._normalizePath(filePath); 
    if (!this.isDirPath() && this.isDir()) {
      this.#path+="/";
    }
    this.#policy=policy;
    if (policy && !policy.topDir.contains(this)) {
      throw new Error(`Cannot create files outside ${policy.topDir}`);
    }
    this._path=this.#path;
  }
  setPolicy(p:Policy) {
    if (this.#policy) throw new Error("policy already set");
    return new SFile(this.#fs, this.#path, p);
  }
  clone(_path?:string) {
    const path=_path||this.#path;
    return new SFile(this.#fs, path, this.#policy);
  }

  // File content methods
  text(str:string):this;
  text():string;
  text(str?:string) {
    if (str === undefined) {
      return this.getText();
    }
    return this.setText(str);
  }
  lines():string[] {
    return this.getText().split("\n");
  }
  getText():string{
    const {fs,path}=this.#fs.deps;
    return fs.readFileSync(this.#path, 'utf8');
  }
  setText(str:string):this {
    const {fs,path}=this.#fs.deps;
    fs.writeFileSync(this.#path, str, 'utf8');
    return this;
  }
  appendText(str:string) {
    const {fs,path}=this.#fs.deps;
    fs.appendFileSync(this.#path, str);
  }
  getBlob() {
    return new Blob([this.bytes()],{type:this.contentType()});
  }
  async setBlob(blob:Blob):Promise<ArrayBuffer> {
    return new Promise(
      (succ:(a:ArrayBuffer)=>void)=>
        blob.arrayBuffer().then((a:ArrayBuffer)=>succ(this.setBytes(a))));
  }
  obj(o:object):this;
  obj():object;
  obj(o?:object) {
    if (o === undefined) {
      return JSON.parse(this.text());
    }
    this.text(JSON.stringify(o, null, 2));
    return this;
  }
  bytes(b:ArrayBuffer):this;
  bytes(b:Buffer):this;
  bytes():Buffer;
  bytes(b?: ArrayBuffer|Buffer) {
    if (b === undefined) {
      return this.getBytes();
    }
    this.setBytes(b);
    return this;
  }
  setBytes(b: ArrayBuffer|Buffer) {
    const {fs,path,Buffer}=this.#fs.deps;
    if (Content.isArrayBuffer(b)) {
      const bb=Buffer.from(b);
      fs.writeFileSync(this.#path, bb);
    } else {
      fs.writeFileSync(this.#path, b);
    }
    return b;
  }
  getBytes({ binType = ArrayBuffer } = {}) {
    const {fs,path}=this.#fs.deps;
    const buffer = fs.readFileSync(this.#path);
    return binType === ArrayBuffer ? buffer.buffer : buffer;
  }
  dataURL(url:string):this;
  dataURL():string;
  dataURL(url?:string):this|string{
    if (!url) {
      return this.getContent().toURL();
    }
    return this.setContent(Content.url(url));
  }

  getMetaInfo():MetaInfo{
    const {fs,path}=this.#fs.deps;
    const stats = fs.statSync(this.#path);
    return {
      lastUpdate: stats.mtimeMs,
    };
  }
  setMetaInfo(m:MetaInfo) {
    const {fs,path}=this.#fs.deps;
    const stats = fs.statSync(this.#path);
    fs.utimesSync(this.#path, stats.atime, new Date(m.lastUpdate));
  }
  size(){
    const {fs,path}=this.#fs.deps;
    const stats = fs.statSync(this.#path);
    return stats.size;
  }
  // File metadata and operations
  lastUpdate():number {
    const {fs,path}=this.#fs.deps;
    const stats = fs.statSync(this.#path);
    return stats.mtimeMs;
  }
  rm(options:{r?:boolean, recursive?:boolean} = {}) {
    const {fs,path}=this.#fs.deps;
    if (this.isDir()) {
      if (options.r || options.recursive) {
        fs.rmSync(this.#path, { recursive: true, force: true });
      } else {
        fs.rmdirSync(this.#path);
      }
    } else {
      fs.unlinkSync(this.#path);
    }
    return this;
  }
  

  exists() {
    const {fs,path}=this.#fs.deps;
    return fs.existsSync(this.#path);
  }

  isDir() {
    const {fs,path}=this.#fs.deps;
    return this.exists() && fs.statSync(this.#path).isDirectory();
  }
  isDirPath(){
    return this.#path.endsWith("/");
  }

  // Path and naming methods
  path() {
    return this.#path;
  }

  name() {
    const {fs,path}=this.#fs.deps;
    return path.basename(this.#path)+(this.#path.endsWith("/")?"/":"");
  }

  ext() {
    const {fs,path}=this.#fs.deps;
    return path.extname(this.#path);
  }

  truncExt(e:string) {
    const name = this.name();
    if (e === undefined) {
      e = this.ext();
    }
    return name.substring(0, name.length-e.length);
  }

  // Relative and navigation methods
  up() {
    const {fs,path}=this.#fs.deps;
    return this.clone(path.dirname(this.#path));
  }

  sibling(name:string) {
    return this.up().rel(name);
  }

  relPath(base:SFile) {
    const {fs,path}=this.#fs.deps;
    return path.relative(base.path(), this.#path).replace(/\\/g,"/")+(this.isDirPath()?"/":"");
  }

  rel(relPath:string) {
    const {fs,path}=this.#fs.deps;
    assert.ok(!path.isAbsolute(relPath), `rel: ${relPath} should be relative`);
    return this.clone(path.join(this.#path, relPath));
  }

  // Copy and move methods
  copyFrom(src:SFile) {
    return src.copyTo(this);
  }
  toString(){return this.#path;}
  copyTo(dst:SFile, options={}):SFile{
    const src=this;
    const srcIsDir=src.isDir();
    let dstIsDir=dst.isDir();
    if (!srcIsDir && dstIsDir) {
      dst=dst.rel(src.name());
      dst.assertRegularFile();
      dstIsDir=false;
    }
    if (srcIsDir && !dstIsDir) {
      throw new Error("Cannot move dir "+src.path()+" to file "+dst.path());
    } else if (!srcIsDir && !dstIsDir) {
      const c=src.getContent();
      dst.setContent(c);
    } else {
      if (!srcIsDir || !dstIsDir) throw new Error(src+" to "+dst+" should both dirs");
      for (let e of src.listFiles()) {
        e.copyTo(dst.rel(e.relPath(src)));
      }
    }
    return dst;
  }

  moveFrom(src:SFile) {
    return src.moveTo(this);
  }

  moveTo(dst:SFile) {
    this.copyTo(dst);
    this.rm();
    return dst;
  }
  contentType() {
    return this.#fs.mimeTypes[this.ext()]||"application/octet-stream";
  }
  isText(){
    return this.contentType().match(/^text\//);
  }
  getContent():Content{
    const {fs,path}=this.#fs.deps;
    if (this.isText()) {
      const text=fs.readFileSync(this.#path, "utf-8");
      if (Content.looksLikeDataURL(text)) {
        return Content.url(text);
      } else {
        return Content.plainText(text);
      }
    } else {
      return Content.bin(fs.readFileSync(this.#path),this.contentType());
    }
  }
  setContent(c:Content):this{
    const {fs,path,Buffer}=this.#fs.deps;
    if (c.hasPlainText()) {
      fs.writeFileSync(this.#path, c.toPlainText());
    } else{
      fs.writeFileSync(this.#path, c.toBin(Buffer));
    }
    return this;
  }
  assertDir() {
    if (!this.isDir()) {
      throw new Error(`${this.path()} is not a directory`);
    }
  }
  assertRegularFile() {
    if (this.isDir()) {
      throw new Error(`${this.path()} is a directory`);
    }
  }
  // Directory methods
  parseExcludeOption(options:DirectoryOptions={}):{excludesF:ExcludeFunction} {
    this.assertDir();
    const excludes=options.excludes;
    if (typeof excludes==="function") {
        return {excludesF:excludes as ExcludeFunction};
    } else if (typeof excludes==="object") {
      const pathR=this.path();
      let nex:ExcludeHash={};
      const cpath=(e:string)=>{
        if (e.startsWith("/")) {
          nex[e]=1;
        } else {
          nex[pathR+e]=1;
        }
      };
      if (Array.isArray(excludes)) {
        for (let e of excludes) cpath(e);
      } else {
        for (let e in excludes) cpath(e);
      }
      return {excludesF:(f)=>nex[f.path()]};
    } else {
      return {excludesF:()=>false};
    }
  }
  each(callback:(file:SFile)=>void, options?:DirectoryOptions) {
    const {fs,path}=this.#fs.deps;
    this.assertDir();
    const files = fs.readdirSync(this.#path);
    const {excludesF}=this.parseExcludeOption(options);
    files.forEach(file => {
      const fileObj = this.rel(file);
      if (!excludesF(fileObj)) callback(fileObj);
    });
    return this;
  }
  recursive():Generator<SFile>;
  recursive(options:DirectoryOptions):Generator<SFile>;
  recursive(callback:FileCallback, options:DirectoryOptions):this;
  recursive(a1?:FileCallback|DirectoryOptions, a2?:DirectoryOptions) {
    const options:DirectoryOptions=a2 ?? ((a1 && typeof a1==="object") ? a1 : {});
    const callback:FileCallback|undefined=(a1 && typeof a1==="function" ? a1 : undefined); 
    this.assertDir();
    if (callback) {
      for (let file of this.recursive(options)) {
        callback(file);
      }
      return this;
    } else {
      const includeDir=options.includeDir;
      const {excludesF}=this.parseExcludeOption(options);
      const self=this;
      return {
        *[Symbol.iterator](){
          function* walk(dir: SFile):Generator<SFile> {
            //console.log("walk", dir.path(),includeDir);
            if (includeDir) {
              yield dir;
            }
            for (const file of dir.listFiles(options)) {
              if (file.isDir()) {
                yield* walk(file);
              } else {
                yield file;
              }             
            }
          }
          yield* walk(self);
        }
      };
    }
  }
  
  getDirTree(options:GetDirTreeOptions={style: "flat-absolute"}):DirTree {
    let dest = {} as DirTree;
    options.style = options.style || "flat-absolute";
    let excludesFunc:GetDirTreeExcludeFunction;
    if (typeof options.excludes==="function") {
        excludesFunc=options.excludes as GetDirTreeExcludeFunction;
    } else {
        const excludesAry = options.excludes || [];
        const defaultExcludes=(f:SFile, {fullPath, relPath, ...options}: GetDirTreeExcludeFunctionArgs)=>{
            switch (options.style) {
                case "flat-relative":
                case "hierarchical":
                    if (excludesAry.indexOf(relPath) >= 0) {
                        return true;
                    }
                    break;
                case "flat-absolute":
                    if (excludesAry.indexOf(fullPath) >= 0) {
                        return true;
                    }
                    break;
            }
            return false;
        };
        excludesFunc=defaultExcludes;
    }
    let base=options.base||this;
    const files = this.listFiles(options);
    if (options.style == "no-recursive") {
      for (let file of files) {
        dest[file.name()] = this.getMetaInfo();
      }
      return dest;
    }
    const newoption = {style: options.style, base};
    for (let file of files) {
        const meta = file.getMetaInfo();
        const fullPath = file.path();
        const relPath = file.relPath(base);
        if (excludesFunc(file, {fullPath, relPath,  ...options})) continue;
        if (file.isDir()) {
            switch (options.style) {
                case "flat-absolute":
                case "flat-relative":
                    Object.assign(dest, file.getDirTree(newoption));
                    break;
                case "hierarchical":
                    dest[file.name()] = file.getDirTree(newoption);
                    break;
            }
        } else {
            switch (options.style) {
                case "flat-absolute":
                    dest[fullPath] = meta;
                    break;
                case "flat-relative":
                    dest[relPath] = meta;
                    break;
                case "hierarchical":
                    dest[file.name()] = meta;
                    break;
            }
        }
    }
    return dest;
  }


  listFiles(options?:DirectoryOptions) {
    const {fs,path}=this.#fs.deps;
    const {excludesF}=this.parseExcludeOption(options);
    if (!this.isDir()) {
      throw new Error(this+' is not a directory');
    }
    return fs.readdirSync(this.#path).map(file => this.rel(file)).filter(f=>!excludesF(f));
  }

  ls(options?:DirectoryOptions) {
    const {fs,path}=this.#fs.deps;
    if (!options) return fs.readdirSync(this.#path);
    return this.listFiles(options).map(f=>f.name());
  }

  mkdir() {
    const {fs,path}=this.#fs.deps;
    fs.mkdirSync(this.#path, { recursive: true });
    return this;
  }
  contains(file:SFile) {
    return file.path().startsWith(this.path());
  }
  isLink():string|null {
    const {fs,path}=this.#fs.deps;
    const stat=fs.lstatSync(this.#path);
    if(!stat.isSymbolicLink())return null;
    return fs.realpathSync(this.#path);
  }
  link(to:SFile) {
    const {fs,path}=this.#fs.deps;
    fs.symlinkSync(to.path(), this.#path);
  }
  resolveLink() {
    const {fs,path}=this.#fs.deps;
    return this.clone(fs.realpathSync(this.#path));
  }
  watch(listener:(eventType:string, file:SFile, meta:MetaInfo)=>void):{remove:()=>void};
  watch(options:any, listener:(eventType:string, file:SFile, meta:MetaInfo)=>void):{remove:()=>void};
  watch(_1?:any, _2?:any) {
    let options={},listener:(eventType:string, file:SFile, meta:MetaInfo)=>void=function(){};
    if (typeof _1==="object") options=_1;
    if (typeof _2==="object") options=_2;
    if (typeof _1==="function") listener=_1;
    if (typeof _2==="function") listener=_2;
    const {fs,path}=this.#fs.deps;
    const watcher=fs.watch(this.#path, options,(eventType:string, filename:string|null) => {
      const file=filename? (
        this.#fs.deps.path.isAbsolute(filename) ? 
          this.clone(filename) : 
          this.rel(filename)
      ):this;
      listener(eventType, file, file.getMetaInfo());
    });
    return {
      remove:()=>{
        watcher.close();
      }
    };
  }

}
