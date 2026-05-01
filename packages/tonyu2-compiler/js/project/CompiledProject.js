import * as F from "./ProjectFactory.js";
import { sourceFiles } from "../lang/SourceFiles.js";
import langMod from "../lang/langMod.js";
F.addType("compiled", (params) => {
    if (params.namespace && params.url)
        return urlBased(params);
    if (params.namespace && params.outputFile)
        return outputFileBased(params);
    if (params.dir)
        return dirBased(params);
    console.error("Invalid compiled project", params);
    throw new Error("Invalid compiled project");
});
function urlBased(params) {
    const ns = params.namespace;
    const url = params.url;
    const res = F.createCore();
    return res.include(langMod).include({
        getNamespace: function () { return ns; },
        getOutputURL() {
            return url;
        },
        async loadClasses() {
            console.log("Loading compiled classes ns=", ns, "url=", url);
            await this.loadDependingClasses();
            const s = sourceFiles.add({ url });
            await s.exec();
            console.log("Loaded compiled classes ns=", ns, "url=", url);
        },
    });
}
function dirBased(params) {
    const res = F.createDirBasedCore(params);
    return res.include(langMod).include({
        loadClasses: async function () {
            console.log("Loading compiled classes params=", params);
            await this.loadDependingClasses();
            const outJS = this.getOutputFile();
            const map = outJS.sibling(outJS.name() + ".map");
            const sf = sourceFiles.add({
                //text:outJS.text(),
                file: outJS,
                sourceMap: map.exists() ? map.text() : undefined,
            });
            await sf.exec();
            console.log("Loaded compiled classes params=", params);
        }
    });
}
function outputFileBased(params) {
    const ns = params.namespace;
    const outputFile = params.outputFile;
    const res = F.createCore();
    return res.include(langMod).include({
        getNamespace: function () { return ns; },
        getOutputFile() {
            return outputFile;
        },
        loadClasses: async function (ctx) {
            console.log("Loading compiled classes ns=", ns, "outputFile=", outputFile);
            await this.loadDependingClasses();
            const outJS = outputFile;
            const map = outJS.sibling(outJS.name() + ".map");
            const sf = sourceFiles.add({
                text: outJS.text(),
                sourceMap: map.exists() ? map.text() : undefined,
            });
            await sf.exec();
            console.log("Loaded compiled classes ns=", ns, "outputFile=", outputFile);
        },
    });
}
export function isDirBasedProject(prj) {
    return prj.resolve;
}
export const create = (params) => F.create("compiled", params);
F.addDependencyResolver((prj, spec) => {
    if (spec.dir && isDirBasedProject(prj)) {
        return F.create("compiled", { dir: prj.resolve(spec.dir) });
    }
    if (spec.namespace && spec.url) {
        return F.create("compiled", spec);
    }
    if (spec.namespace && spec.outputFile && isDirBasedProject(prj)) {
        return F.create("compiled", {
            namespace: spec.namespace,
            outputFile: prj.resolve(spec.outputFile)
        });
    }
});
//# sourceMappingURL=CompiledProject.js.map