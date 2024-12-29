import * as _assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as zip from "jszip";
import {FileSystemFactory,SFile,Content, DirectoryOptions, DirTree, MetaInfo, ExcludeOption, ExcludeHash} from "../src/SFile.js";
const assert = Object.assign(
    (b:any, m?:string)=>_assert.ok(b,m),{
    eq:_assert.equal,   
    ensureError: _assert.throws,
});

const exAttr={atimeMs:1, atime:1,ctimeMs:1, ctime:1};
const timeout = (t:number) => new Promise(s => setTimeout(s, t));
declare const location:any;
const alert:Function=(s:string)=>console.log("ALERT",s);
        
export async function main(){
let pass:number=0;
//let testf: SFile;
const cleanups=[] as Function[];
try {
    const FS=new FileSystemFactory({fs, path});
    console.log(import.meta.url);
    const topDir=FS.get(import.meta.url).sibling("fixture/");
    const root=topDir;//.setPolicy({topDir});
    let cd =root;
    const r=root.rel.bind(root);
    const romd=r("rom/");
    // check relpath:
    //  path= /a/b/c   base=/a/b/  res=c
    assert.eq(r("a/b/c").relPath(r("a/b/")) , "c");
    assert.eq(r("a/b/c").relPath(root.rel("a/b/")) , "c");
    //  path= /a/b/c/   base=/a/b/  res=c/
    assert(r("a/b/c/").path().endsWith("/"), "endsWith/ "+r("a/b/c/").path());
    assert(r("a/b/c/").isDirPath(), "dirpath");
    assert.eq(r("a/b/c/").relPath(r("a/b/")) ,"c/");
    //  path= /a/b/c/   base=/a/b/c/d  res= ../
    assert.eq(r("a/b/c/").relPath(r("a/b/c/d")) , "../");
    //  path= /a/b/c/   base=/a/b/e/f  res= ../../c/
    assert.eq(r("a/b/c/").relPath(r("a/b/e/f")) , "../../c/");
    // ext()
    assert.eq(root.rel("test.txt").ext(), ".txt");
    //assert.eq(P.normalize("c:\\hoge/fuga\\piyo//"), "c:/hoge/fuga/piyo/");
    console.log(r("hoge/fuga\\"),(r("hoge\\fuga/piyo//")), "isChildOf");
    assert(r("hoge/fuga\\").contains(r("hoge\\fuga/piyo//")), "isChildOf");
    assert(!r("hoge/fugo\\").contains(r("hoge\\fuga/piyo//")), "!isChildOf");
    testContent();
    let ABCD = "abcd\nefg";
    let CDEF = "defg\nてすと";
    //obsolate: ls does not enum mounted dirs
    //assert(r.indexOf("rom/")>=0, r);
    //let romd = root.rel("rom/");
    let ramd = root.rel("ram/");
    if(ramd.exists())ramd.rm({r:true});
    ramd.mkdir();
    const testf = root.rel("testfn.txt");
    cleanups.push(()=>testf.exists() && testf.rm());  
    let testd: SFile;
    if (!testf.exists()) {
        pass=1;
        console.log("Test #", pass);
        testd = cd = cd.rel(/*Math.random()*/"testdir" + "/");
        console.log("Enter", cd);
        testd.mkdir();
        //--- check exists
        assert(testd.exists());
        //--- check lastUpdate
        let d = new Date().getTime();
        testf.text(testd.path());
        console.log("lastUpdate", testf.lastUpdate(), d);
        assert(Math.abs(testf.lastUpdate() - d) <= 1000);
        testd.rel("test.txt").text(ABCD);
        assert(romd.rel("Actor.tonyu").text().length > 0);
        testd.rel("sub/test2.txt").text(romd.rel("Actor.tonyu").text());
        let tncnt:string[] = [];
        const pushtn=(f:SFile)=>tncnt.push(f.relPath(romd));
        romd.recursive(pushtn, { 
            // Notice: f.ext() !== ".tonyu" only does not work since it skips directories (and *.tonyu file its subdirectories).
            excludes:(f:SFile)=>(!f.isDir() && f.ext() !== ".tonyu")
        });
        console.log(".tonyu files in "+romd, tncnt);
        assert.eq(tncnt.length, 46, "tncnt");

        tncnt = [];
        romd.recursive(pushtn, { 
            excludes:(f:SFile)=>!f.isDir(),
            includeDir:true,
        });
        console.log("directories in "+romd, tncnt);
        assert.eq(tncnt.length, 9, "tncnt");

        tncnt = [];
        let exdirs = ["physics/", "event/", "graphics/"];
        romd.recursive(pushtn, { excludes: exdirs });
        console.log("files in "+ romd+" except", exdirs, tncnt);
        assert.eq(tncnt.length, 33, "tncnt");
        checkGetDirTree(romd);

        assert(testd.rel("sub/").exists());
        assert(root.rel("testdir/sub/").exists());
        assert(testf.exists());
        let sf = testd.setPolicy({ topDir: testd });//SandBoxFile.create(testd._clone());
        assert(sf.rel("test.txt").text() == ABCD);
        sf.rel("test3.txt").text(CDEF);
        /*assert.ensureError(function () {
            let rp = romd.rel("Actor.tonyu").relPath(sf);
            console.log(rp);
        })*/;
        assert.eq(sf.rel("test3.txt").text(), CDEF);
        assert.ensureError(function () {
            sf.rel("../rom/Actor.tonyu").text();
        });
        sf.rel("test3.txt").rm();
        assert(!testd.rel("test3.txt").exists());
        //let ramd=r("ram/");
        ramd.rel("toste.txt").text("fuga");
        assert.ensureError(function () {
            ramd.rel("files").link(testd);
        });
        ramd.rel("files/").link(testd);
        testd.rel("sub/del.txt").text("DEL");
        assert(ramd.rel("files/").isLink());
        assert.eq(ramd.rel("files/test.txt").resolveLink().path(), testd.rel("test.txt").path());
        assert.eq(ramd.rel("files/test.txt").text(), ABCD);
        assert.eq(ramd.rel("files/sub/test2.txt").text(), romd.rel("Actor.tonyu").text());
        ramd.rel("files/sub/del.txt").rm();
        assert(!testd.rel("sub/del.txt").exists());
        ramd.rel("files/sub/del.txt").rm();
        assert(!testd.rel("sub/del.txt").exists());
        ramd.rel("files/").rm();
        assert(testd.exists());
        const nfs=testd;
        console.log(nfs.ls());
        nfs.rel("sub/test2.txt").text(romd.rel("Actor.tonyu").text());
        nfs.rel("test.txt").text(ABCD);
        let pngurl = nfs.rel("Tonyu/Projects/MapTest/images/park.png").text();
        assert(pngurl.startsWith("data:"));
        nfs.rel("sub/test.png").text(pngurl);

        nfs.rel("sub/test.png").copyTo(testd.rel("test.png"));
        chkCpy(nfs.rel("Tonyu/Projects/MapTest/Test.tonyu"));
        chkCpy(nfs.rel("Tonyu/Projects/MapTest/images/park.png"));
        chkCpy(testd.rel("test.png"));
        testd.rel("test.png").rm();
        //---- test append
        let beforeAppend = nfs.rel("Tonyu/Projects/MapTest/Test.tonyu");
        let appended = nfs.rel("Tonyu/Projects/MapTest/TestApp.tonyu");
        beforeAppend.copyTo(appended);
        let apText = "\n//tuikasitayo-n\n";
        appended.appendText(apText);
        assert.eq(beforeAppend.text() + apText, appended.text());
        checkMtime(appended);
        //await checkRemoveError(nfs);
        checkGetDirTree_nw(nfs);
    
        console.log(testd.rel("test.txt").path(), testd.rel("test.txt").text());
        testd.rel("test.txt").text(romd.rel("Actor.tonyu").text() + ABCD + CDEF);
        chkCpy(testd.rel("test.txt"));
        testd.rel("test.txt").text(ABCD);
        //testEach(testd);
        //--- the big file
        //if (typeof localStorage!=="undefined" && !nfs) await chkBigFile(testd);

        //------------------
        
        // blob->blob
        let f = testd.rel("hoge.txt");
        f.text("hogefuga");
        checkMtime(f);
        let tmp = testd.rel("fuga.txt");
        let b = f.getBlob();
        console.log("BLOB reading...", f.name(), tmp.name());
        await tmp.setBlob(b);
        checkSame(f, tmp);
        console.log("BLOB read done!", f.name(), tmp.name());
        tmp.rm();
        f.rm();
        
        //setTimeout(function () {location.reload();},10000);
        await asyncTest(testd);

    } else {
        try {
            pass=2;
            console.log("Test #", pass);
            //testf = root.rel("testfn.txt");
            testd = cd = FS.get(testf.text());
            assert(cd.exists());
            console.log("Enter", cd);
            assert(testd.rel("test.txt").text() === ABCD);
            assert(testd.rel("sub/").exists());
            assert(testd.rel("sub/test2.txt").text() === romd.rel("Actor.tonyu").text());
            chkRecur(testd, {}, ["test.txt","sub/test2.txt"]);
            console.log("testd.size", testd.size());
            assert.eq(testd.size(), ABCD.length + testd.rel("sub/test2.txt").size(), "testd.size");
            eqa(testd.ls(), ["test.txt","sub/"]);
            chkRecur(testd, { excludes: ["sub/"] }, ["test.txt"]);
            testd.rel("test.txt").rm();
            chkRecur(testd, {}, ["sub/test2.txt"]);
            console.log("FULLL", testd.path());
            //console.log("FULLL", localStorage[testd.path()]);
            chkRecur(testd, {}, ["test.txt","sub/test2.txt"]);
            testd.rel("test.txt").rm();
            chkRecur(testd, {}, ["sub/test2.txt"]);


            testd.rm({ r: true });
            assert(!testd.exists());
            testf.rm({ r: true });
            assert(!testf.exists());
            assert(!testd.rel("test.txt").exists());
            /*await ramd.rel("a/b.txt").text("c").then(function () {
                return ramd.rel("c.txt").text("d");
            }).then(function () {
                return chkRecurAsync(ramd, {}, ["a/b.txt","c.txt"]);
            });*/
            const nfs=testd;
            assert.eq(nfs.rel("sub/test2.txt").text(), romd.rel("Actor.tonyu").text());
            assert.eq(nfs.rel("test.txt").text(), ABCD);
            let pngurl = nfs.rel("Tonyu/Projects/MapTest/images/park.png").text();
            assert.eq(nfs.rel("sub/test.png").text(), pngurl);
        } finally {
           
        }
    }
    console.log("#"+pass+" test passed. ");
    if (pass==1) {
        await timeout(1000);
        if (typeof location!=="undefined" && !location.href.match(/pass1only/)) location.reload();
    } else {
        console.log("All test passed.");
    }
} catch (e) {
    console.log((e as any).stack);
    alert("#"+pass+" test Failed. "+e);
    try {
        for (let c of cleanups) c();
    } catch (e) {
        console.error(e);
    }
}
/*
async function chkBigFile(testd: SFile) {
    let cap = LSFS.getCapacity();
    console.log("usage", cap);
    if (cap.max < 100000000) {
        let len = cap.max - cap.using + 1500;
        let buf = "a";
        while (buf.length < len) buf += buf;
        let bigDir = testd.rel("bigDir/");
        let bigDir2 = bigDir.sibling("bigDir2/");
        if (bigDir2.exists()) bigDir2.rm({ r: 1 });
        let bigFile = bigDir.rel("theBigFile.txt");
        assert.ensureError(function () {
            console.log("Try to create the BIG ", buf.length, "bytes file");
            return bigFile.text(buf);
        });
        assert(!bigFile.exists(), "BIG file remains...?");
        buf = buf.substring(0, cap.max - cap.using - 1500);
        buf = buf.substring(0, buf.length / 10);
        for (let i = 0; i < 6; i++) bigDir.rel("test" + i + ".txt").text(buf);
        await bigDir.moveTo(bigDir2).then(
            function () { alert("You cannot come here(move big)"); },
            function (e) {
                console.log("Failed Successfully! (move big!)", e);
                return DU.resolve();
            }
        ).then(function () {
            for (let i = 0; i < 6; i++) assert(bigDir.rel("test" + i + ".txt").exists());
            assert(!bigDir2.exists(), "Bigdir2 (" + bigDir2.path() + ") remains");
            console.log("Bigdir removing");
            bigDir.removeWithoutTrash({ recursive: true });
            bigDir2.removeWithoutTrash({ recursive: true });
            assert(!bigDir.exists());
            console.log("Bigdir removed!");
            return DU.resolve();
        });//.then(DU.NOP, DU.E);
    }
}*/
function chkCpy(f:SFile) {
    let tmp = f.up().rel("tmp_" + f.name());
    f.copyTo(tmp);
    checkSame(f, tmp);
    tmp.text("DUMMY");

    let c = f.getContent();
    tmp.setContent(c);
    checkSame(f, tmp);
    tmp.text("DUMMY");

    // plain->plain(.txt) / url(bin->URL)->url(URL->bin) (.bin)
    let t = f.text();
    tmp.text(t);
    checkSame(f, tmp);
    tmp.text("DUMMY");

    // url(bin->URL)->url(URL->bin)
    t = f.dataURL();
    tmp.dataURL(t);
    checkSame(f, tmp);
    tmp.text("DUMMY");

    // bin->bin
    let b = f.getBytes();
    //console.log("f.getBytes",b);
    tmp.setBytes(b);
    //console.log("tmp.getBytes",tmp.getBytes());
    //console.log(peekStorage(f));
    //console.log(peekStorage(tmp));
    checkSame(f, tmp);
    
    // bin->Uint8Array->bin
    let c2=Content.bin(b, f.contentType());
    let bins=c2.toArrayBuffer();
    console.log("bins",b,c2,bins);
    tmp.setBytes(new Uint8Array(bins));
    tmp.text("DUMMY");


    if (f.isText()) {
        // plain->bin(lsfs) , bin->plain(natfs)
        b = f.getBytes();
        c = Content.bin(b, "text/plain");
        t = c.toPlainText();
        tmp.setText(t);
        checkSame(f, tmp);
        tmp.text("DUMMY");
    }
    tmp.rm({r:true});
}
function checkSame(a:SFile, b:SFile) {
    console.log("check same", a.name(), b.name(), a.text().length, b.text().length);
    if(a.text() !== b.text()) {
        throw new Error("text is not match: " + a + "!=" + b+"\n"+
        "content ----\n"+a.text()+"\n----\n"+b.text());
    }
    let _a1 = a.getBytes({ binType: ArrayBuffer });
    let _b1 = b.getBytes({ binType: ArrayBuffer });
    let a1 = new Uint8Array(_a1);
    let b1 = new Uint8Array(_b1);
    console.log("bin dump:", a1[0], a1[1], a1[2], a1[3]);
    assert(a1.length > 0, "shoule be longer than 0");
    assert(a1.length == b1.length, "length is not match: " + a + "," + b);
    for (let i = 0; i < a1.length; i++) assert(a1[i] == b1[i], "failed at [" + i + "]");
}
function contEq(a:Uint8Array|string, b:Uint8Array|string) {
    if (typeof a!==typeof b)return false;
    if (typeof a==="string") return a===b;
    if (typeof b==="string") return false;
    a = new Uint8Array(a);
    b = new Uint8Array(b);
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i]!==b[i]) return false;
    return true;
}

function eqa(a:any[],b:any[]) {
    _assert.deepStrictEqual(a.sort().join(","),b.sort().join(","));
}
function chkRecur(dir:SFile, options:DirectoryOptions, result:string[]) {
    const di = [] as string[];
    dir.recursive(function (f) {
        di.push(f.relPath(dir));
    }, options);
    eqa(di, result);
    let t = dir.getDirTree({excludes:options.excludes,style:"flat-relative"});
    console.log("getDirTree",dir, t);
    eqa(Object.keys(t), result);
}
function testContent() {
    let C = Content;
    const a=[0xe3, 0x81, 0xa6, 0xe3, 0x81, 0x99, 0xe3, 0x81, 0xa8, 0x61, 0x62, 0x63];
    const conts:{[key:string]: [string|ArrayBufferLike, ( ((s:string)=>Content)| ((s:ArrayBufferLike)=>Content) ) , (c:Content)=>string|ArrayBufferLike]}={
        p:["てすとabc", (s:string)=>C.plainText(s), (c:Content)=>c.toPlainText()],
        u:["data:text/plain;base64,44Gm44GZ44GoYWJj", (u:string)=>C.url(u), (c:Content)=>c.toURL()],
        a:[Uint8Array.from(a).buffer, (a:ArrayBufferLike)=>C.bin(a, "text/plain"), (c:Content)=>c.toArrayBuffer()],
        n:[Buffer.from(a),(n:ArrayBufferLike)=>C.bin(n, "text/plain"), (c:Content)=>c.toNodeBuffer()],
    };
    /*if (typeof Buffer!=="undefined") {
        conts.n=[Buffer.from(a),(n)=>C.bin(n, "text/plain"), (c)=>c.toNodeBuffer()];
    }*/
    const SRC=0, TOCONT=1, FROMCONT=2;
    let binLen=(conts.a[SRC] as ArrayBufferLike).byteLength;
    for (let tfrom of Object.keys(conts) ) 
        for (let tto of Object.keys(conts) ) chk(tfrom,tto);
    function chk(tfrom: string ,tto:string) {
        const src=conts[tfrom][SRC];
        const c=conts[tfrom][TOCONT](src as any);
        if (c.hasNodeBuffer()) {
            assert.eq(((c as any).nodeBuffer as Buffer).length, binLen,"Bin length not match");
        }
        const dst=conts[tto][FROMCONT](c);
        console.log("Convert Content ",tfrom,"->",tto);
        if (!contEq(dst as any, conts[tto][SRC] as any)) {
            console.log("Actual: ",dst);
            console.log("Expected: ",conts[tto][SRC]);
            console.log("Content bufType ", c.bufType );
            throw new Error(`Fail at ${tfrom} to ${tto}`);
        }
    }

    /*let c1 = C.plainText(s);
    test(c1, [s]);

    function test(c, path) {
        let p = c.toPlainText();
        let u = c.toURL();
        let a = c.toArrayBuffer();
        let n = C.hasNodeBuffer() && c.toNodeBuffer();
        console.log("TestCont", path, "->", p, u, a, n);
        let cp = C.plainText(p);
        let cu = C.url(u);
        let ca = C.bin(a, "text/plain");
        let cn = n && C.bin(n, "text/plain");
        if (path.length < 2) {
            test(cp, path.concat([p]));
            test(cu, path.concat([u]));
            test(ca, path.concat([a]));
            if (n) test(cn, path.concat([n]));
        } else {
            //assert.eq(cp,p, "cp!=p");
            //assert.eq(cu,u, "cu!=u");
        }
    }*/
}
async function asyncTest(testd:SFile) {
    //await checkZip(testd);
    await checkWatch(testd);
}
async function checkWatch(testd:SFile) {
    const buf = [] as string[];
    //const isN = NativeFS.available && testd.getFS() instanceof NativeFS;
    //console.log("isN",isN);
    const isN=false
    const w = testd.watch((type, f) => {
        buf.push(type + ":" + f.relPath(testd));
    });
    async function buildScrap(f:SFile, t = "aaa") {
        console.log("buildScrap",f.path());
        await timeout(100);
        f.text(t);
        await timeout(100);
        f.text(t + "!");
        await timeout(100);
        f.rm();
    }
    await buildScrap(testd.rel("hogefuga.txt"));
    w.remove();
    await buildScrap(testd.rel("hogefuga.txt"));
    console.log("checkWatch", buf);
    const uniq=(a:string[])=>{
        const has=new Set();
        const res=[];
        for (let e of a) {
            if (has.has(e)) continue;
            has.add(e);
            res.push(e);
        }
        return res;
    };
    assert.eq(uniq(buf).join("\n"), (isN?uniq([
        "rename:hogefuga.txt",
        "change:hogefuga.txt",
        "change:hogefuga.txt",
        "change:hogefuga.txt",
        //"change:hogefuga.txt",
    ]):uniq([
        "create:hogefuga.txt",
        "change:",
        "change:hogefuga.txt",
        "change:",
        "delete:hogefuga.txt",
        "change:"
    ])).join("\n"), "checkWatch");

}
function checkMtime(f:SFile) {
    const t=f.lastUpdate();
    const nt=t-30*60*1000;
    f.setMetaInfo({lastUpdate:nt});
    console.log("checkMtime", f.path(), t, nt);
    assert(Math.abs(f.lastUpdate()-nt)<2000);
}
/*
async function checkZip(dir:SFile) {
    const cleanExt=async ()=>{
        assert.eq(ext.name(),"ext/");
        if (ext.exists()) {
            for (let i=0;i<10;i++) {
                try {
                    await ext.rm({ recursive: true });
                    break;
                } catch(e) {
                    console.log("Rm"+ext+" retry... "+i);
                    await timeout(1000);
                }    
            }
            assert(!ext.exists(),ext+" remains ");        
        }    
    };
    await timeout(3000);
    let ext = dir.rel("ext/");
    await cleanExt();
    dir.rel("ziping.txt").text("zipping");
    let tre = dir.getDirTree();
    console.log("TRE", tre);
    const zipf = FS.get("/ram/comp.zip");
    await FS.zip.zip(dir, zipf);
    ext.mkdir();
    await FS.zip.unzip(zipf, ext);

    let tre2 = ext.getDirTree();
    console.log("TRE2", tre2);
    dir.rel("ziping.txt").removeWithoutTrash();
    await cleanExt();
    assert.eq(Object.keys(tre).length, Object.keys(tre2).length);
    for (let k2 of Object.keys(tre2)) {
        let k = k2.replace(/\/ext/, "");
        console.log(k, k2);
        assert(k2 in tre2);
        assert(k in tre);
        assert(tre[k].lastUpdate);
        console.log(tre[k].lastUpdate - tre2[k2].lastUpdate);
        //assert(Math.abs(tre[k].lastUpdate-tre2[k2].lastUpdate)<2000);
        assert(Math.abs(
            Math.floor(tre[k].lastUpdate / 2000) -
            Math.floor(tre2[k2].lastUpdate / 2000)) <= 2,
            `Zip timestamp not match ${k}=${tre[k].lastUpdate}, ${k2}=${tre2[k2].lastUpdate}, Diff=${tre[k].lastUpdate - tre2[k2].lastUpdate}`
        );
    }
    await timeout(1000);
}*/
function getDirTree3Type(dir:SFile, excludes?:ExcludeOption) {
    if (!excludes) {
        excludes={};
    } else if (Array.isArray(excludes)) {
        excludes={
            hier:excludes, rel:excludes,
            abs:excludes.map(e=>dir.rel(e).path()),
        };
    } else if (typeof excludes==="function") {
        excludes={
            hier:excludes, rel:excludes,
            abs:excludes
        };
    }
    const hier=dir.getDirTree({style:"hierarchical",excludes:excludes.hier});
    console.log("hier",hier);
    const rel=dir.getDirTree({style:"flat-relative",excludes:excludes.rel});
    console.log("rel",rel);
    const abs=dir.getDirTree({style:"flat-absolute",excludes:excludes.abs});
    console.log("abs",abs);
    eqtree3(hier, rel,abs);
    return {hier, rel, abs};
    function eqtree3(hier:DirTree,rel:DirTree,abs:DirTree) {
        eqtree2(rel,abs);
        eqtreeH(rel,hier);
    }
    function eqtreeH(rel:DirTree, hier:DirTree){
        const uncheckedRel={} as {[key:string]:number};
        for (let k in rel) uncheckedRel[k]=1;
        function loop(hier:DirTree, path:string) {
            for (let k in hier) {
                let np=path+k;
                //console.log("hier, k, path", hier, k, path);
                delete uncheckedRel[np];
                if (k.match(/\/$/)) {
                    loop(hier[k] as DirTree, np);    
                } else {
                    eqTree(rel[np] as MetaInfo, hier[k] as MetaInfo, np, exAttr);
                }
            }    
        }
        loop(hier,"");
        assert(Object.keys(uncheckedRel).length==0,"Unchecked rel: "+Object.keys(uncheckedRel).length);
    }   
    function eqtree2(rel: DirTree, abs:DirTree){
        const uncheckedAbs={} as {[key:string]:number};
        for (let k in abs) uncheckedAbs[k]=1;
        for (let k in rel) {
            const absk=dir.rel(k).path();
            //console.log("k-absk",k, absk);
            delete uncheckedAbs[absk];
            eqTree(abs[absk], rel[k], k, exAttr);
        }
        assert(Object.keys(uncheckedAbs).length==0,"Unchecked abs: "+Object.keys(uncheckedAbs).length);
    }
}
function checkGetDirTree(dir: SFile) {
    const noex=getDirTree3Type(dir);
    assert.eq(Object.keys(noex.abs).length,50, "count of dirtree abs");
    assert.eq(Object.keys(noex.rel).length,50, "count of dirtree rel");
    assert.eq(Object.keys(noex.hier).length,17, "count of dirtree hier");

    const exa=getDirTree3Type(dir,["event/"]);
    assert.eq(Object.keys(exa.abs).length,50-6, "count of dirtree abs-ea");
    assert.eq(Object.keys(exa.rel).length,50-6, "count of dirtree rel-ea");
    assert.eq(Object.keys(exa.hier).length,17-1, "count of dirtree hier-ea");

    function exfn(f:SFile) {
        return f.isDir() && f.rel("CrashToHandler.tonyu").exists();
    }
    const exf=getDirTree3Type(dir,exfn);
    
    assert.eq(Object.keys(exf.abs).length,50-6, "count of dirtree abs-ef");
    assert.eq(Object.keys(exf.rel).length,50-6, "count of dirtree rel-ef");
    assert.eq(Object.keys(exf.hier).length,17-1, "count of dirtree hier-ef");

    eqTree(exf.hier, exa.hier, "hier_efea", exAttr);
    eqTree(exf.rel, exa.rel, "rel_efea", exAttr);
    eqTree(exf.abs, exa.abs, "abs_efea", exAttr);
}
function checkGetDirTree_nw(dir: SFile) {
    const noex=getDirTree3Type(dir);
    console.log("getDirTree-nw", noex);
}
/*
async function checkRemoveError(dir) {
    const fs=await import("fs");
    dir=dir.rel("rmtest/");
    dir.mkdir();
    const locked=dir.rel("locked.txt");
    locked.text("test");
    const np=locked.fs.toNativePath(locked.path());
    console.log("np",np);
    fs.chmodSync(np,0o400);
    await timeout(10000);
    fs.unlinkSync(np);
    console.log("WHT!!!",np);
    await assert.ensureErrorAsync(()=>dir.rm({r:true}));
    fs.chmodSync(np,0o666);
    await dir.rm({r:true});
    assert(!dir.exists(), dir+" remains (checkRemove)");    
}*/
function eqTree(a:any, b:any, path:string, excludes:ExcludeHash) {
    assert.eq(typeof a, typeof b, "typeof not match:"+path);
    if (a==null) {
        assert(b==null, "both should be null: "+path);
        return;
    } 
    if (typeof a!=="object") {
        assert(a===b, `non-equal non-object: ${path} ${a}!==${b}`);
        return;
    }
    for (let k in a) {
        if (excludes[k]) continue;
        eqTree(a[k], b[k], path+"."+k, excludes);
    }
    for (let k in b) {
        if (excludes[k]) continue;
        eqTree(b[k], a[k], path+"."+k, excludes);
    }
}

}
// of main()
//(globalThis as any).main=main;
main();
