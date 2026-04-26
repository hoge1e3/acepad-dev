//define(function (require,exports,module) {
// This factory will be widely used, even BitArrow.
import { SFile } from "@hoge1e3/sfile";
import { FS } from "./FS.js";
import * as path from "path";
const resolvers = [], types = {};
export const addDependencyResolver = (f) => {
    //f: (prj, spec) => prj
    resolvers.push(f);
};
export const addType = (n, f) => {
    types[n] = f;
};
export const fromDependencySpec = function (prj, spec) {
    for (let f of resolvers) {
        const res = f(prj, spec);
        if (res)
            return res;
    }
    console.error("Invalid dep spec", spec);
    throw new Error("Invalid dep spec" + spec);
    /* else if (typeof dprj=="object") {
        return this.create("compiled", {
            namespace:dprj.namespace,
            url: FS.expandPath(dprj.compiledURL)
        });
    }*/
};
export const create = function (type, params) {
    if (!types[type])
        throw new Error(`Invalid type ${type}`);
    return types[type](params);
};
export class ProjectCore {
    getPublishedURL() {
        throw new Error("Not implemented");
    } //override in BAProject
    getOptions() { return {}; } //stub
    getName() {
        throw new Error("Not implemented");
    }
    getDependingProjects() {
        var opt = this.getOptions();
        var dp = (opt.compiler && opt.compiler.dependingProjects) || [];
        return dp.map(dprj => fromDependencySpec(this, dprj));
    }
    include(mod) {
        const res = this;
        for (let k of Object.getOwnPropertyNames(mod)) {
            const amod = mod;
            if (typeof amod[k] === "function")
                res[k] = amod[k];
        }
        return res;
    }
    delegate(obj) {
        const res = this;
        if (obj.constructor.prototype) {
            const add = (k) => {
                if (typeof obj[k] === "function")
                    res[k] = (...args) => obj[k](...args);
            };
            for (let k of Object.getOwnPropertyNames(obj.constructor.prototype))
                add(k);
        }
        return res;
    }
}
//ProjectCore.factory=exports;
export const createCore = () => new ProjectCore();
const dirBasedMod = {
    getDir() { return this.dir; },
    getName() {
        return this.getDir().name().replace(/\/$/, "");
    },
    resolve(rdir) {
        /*if (rdir instanceof Array) {
            var res=[];
            rdir.forEach(function (e) {
                res.push(this.resolve(e));
            });
            return res;
        }*/
        if (typeof rdir == "string") {
            if (path.isAbsolute(rdir)) {
                return FS.get(path.join(rdir));
            }
            else {
                return this.getDir().rel(rdir);
            }
        }
        if (!SFile.is(rdir))
            throw new Error("Cannot TPR.resolve: " + rdir);
        return rdir;
    },
    getOptions() {
        return this.getOptionsFile().obj();
    },
    getOptionsFile() {
        var resFile = this.getDir().rel("options.json");
        return resFile;
    },
    setOptions(opt) {
        return this.getOptionsFile().obj(opt);
    },
    fixOptions(TPR, opt) {
        if (!opt.compiler)
            opt.compiler = {};
    },
    getOutputFile(lang = "tonyu") {
        var opt = this.getOptions();
        var outF = this.resolve(opt.compiler.outputFile || "js/concat.js");
        if (outF.isDir()) {
            throw new Error("out: directory style not supported");
        }
        return outF;
    },
    removeOutputFile() {
        this.getOutputFile().rm();
    },
    path() { return this.getDir().path(); }, // not in compiledProject
    getEXT() { throw new Error("getEXT must be overriden."); }, //stub
    sourceFiles() {
        const res = {};
        const ext = this.getEXT();
        this.getDir().recursive(collect);
        function collect(f) {
            if (f.endsWith(ext)) {
                var nb = f.truncExt(ext);
                res[nb] = f;
            }
        }
        return res;
    }
};
export const createDirBasedCore = function (params) {
    const res = createCore();
    res.dir = params.dir;
    if (!res.dir.exists())
        throw new Error(res.dir.path() + " Does not exist.");
    return res.include(dirBasedMod);
};
//# sourceMappingURL=ProjectFactory.js.map