import FS from "@hoge1e3/fs-nw";
async function r(){
    FS.os={};
    globalThis.FS=FS;
    const sh=await import("acepad-shell");
    const {main}=await import(process.argv[1]);
    await main.apply(sh,process.slice(2));
}
r();