#!runts
import Builder from "./lang/Builder.js";
import * as F from "./project/ProjectFactory.js";
import langMod from "./lang/langMod.js";
import * as compiledProject from "./project/CompiledProject.js";
import Tonyu from "../../tonyu2-runtime/src/runtime/TonyuRuntime.js";
//import * as FS from "./lib/FS";
//import * as fs from "node:fs";
//import * as SourceFiles from "./lang/SourceFiles";
//import NS2DepSpec from "./project/NS2DepSpec";
import type { DirBasedTonyuProject } from "./project/projectTypes";
import { SFile } from "@hoge1e3/sfile";
import pNode from "petit-node"
//import * as R from "./lib/R";
//const {sourceFiles} = SourceFiles;
export async function main(this:any,...args:any[]) {
const [cmdopt,from,to]=this.pickOptions(args);
const prjDir=this.resolve(".") as SFile;
const run=cmdopt.r;
const daemon=cmdopt.d;
const rename={do:!!cmdopt.ren} as {
    do:boolean,
    from?:string,
    to?:string,
};
/*Tonyu.loadEvent=(e)=>{
    console.log("loadEvent",e);
};*/
//R.setLocale("ja");
if (rename.do) {
    rename.from=from;
    rename.to=to;
    rename.do=!!(rename.from&&rename.to);
}
//if (typeof require==="function") require('source-map-support').install();

F.addType("compilable",({dir})=>{
    return F.createDirBasedCore({dir}).include(langMod);
});
/*const ns2depspec=new NS2DepSpec([
    {namespace:"kernel", dir: "test/fixure/Kernel_offscr/"},
]);*/
F.addDependencyResolver((prj,spec)=>{
    if (spec && spec.namespace==="kernel") {
        return compiledProject.create({
            dir:prjDir.rel("test/fixture/Kernel_offscr/")
        });
    }
});
const prj=F.create("compilable",{dir:prjDir}) as DirBasedTonyuProject;  //F.createDirBasedCore({dir:prjDir}).include(langMod);
const builder=new Builder(prj);
if (rename.do) {
    console.log(rename);
    const r=await builder.renameClassName(rename.from!, rename.to!)
    console.log("Renamed", r.map(e=>e.path()));
    return;
}
let opt={destinations:{file:true,memory:true}};
if (daemon) opt={destinations:{file:false,memory:true}};
    const s=await builder.fullCompile(opt);
    if (run) {
        const script=prj.getOutputFile();
        await pNode.import("file://"+script.path());
    }
    if (daemon) {
        const tmpdir=prj.getOutputFile().up();
        await s.exec();//{tmpdir});
        let lastRefreshed=new Date().getTime();
        prjDir.watch(async (e,f)=>{
            console.log(e,f.path());
            const now=new Date().getTime();
            if (now-lastRefreshed<500) return;
            lastRefreshed=new Date().getTime();
            const ns=await builder.postChange(f);
            //console.log(ns);
            await ns.exec();
            if ((globalThis as any).Tonyu.globals.$restart) (globalThis as any).Tonyu.globals.$restart();

        });
    }
    if (run||daemon) {
        //let Tonyu=root.Tonyu;
        Tonyu.onRuntimeError=(e)=>console.error(e);
        Tonyu.globals.$builder=builder;
        Tonyu.globals.$currentProject=prj;
        let th=Tonyu.thread();
        const popt=prj.getOptions();
        let MainClass,useBoot=false;
        let mainClassName;
        if (popt && popt.run && popt.run.bootClass) {
            mainClassName=popt.run.bootClass;
            MainClass=Tonyu.getClass(mainClassName);
            useBoot=true;
        } else {
          mainClassName=`${prj.getNamespace()}.Main`;
            MainClass=Tonyu.getClass(mainClassName);
        }
        if (!MainClass) throw new Error(`Main Class ${mainClassName} not found`);
        let mainObj=new MainClass();
        th.apply(mainObj,"main");
        function stepsLoop() {
            th.steps();
            if (th.preempted) {
                console.log("PREEMPTED");
                setTimeout(stepsLoop,0);
            }    
        }
        if (!useBoot) stepsLoop();
        /*th.then(r=>console.log("Done",r),e=>{
            //sourceFiles.decodeTrace(e);
            console.error(e);
        });*/
    }
}