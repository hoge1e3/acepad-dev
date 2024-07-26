import FS from "@hoge1e3/fs-nw";
async function r(){
    FS.os={};
    globalThis.FS=FS;
    const {sh}=await import("acepad-shell");
    const mod=await import(process.argv[2]);
    //console.log(sh);
    await mod.main.apply(sh,process.argv.slice(3));
}
r();