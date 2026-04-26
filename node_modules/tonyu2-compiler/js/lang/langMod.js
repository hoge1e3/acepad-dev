export function hasLangMod(p) {
    const a = p;
    return a?.getNamespace && a?.loadClasses;
}
export default {
    getNamespace() {
        var opt = this.getOptions();
        if (opt.compiler && opt.compiler.namespace)
            return opt.compiler.namespace;
        throw new Error("Namespace is not set");
    },
    async loadDependingClasses() {
        const myNsp = this.getNamespace();
        for (let p of this.getDependingProjects()) {
            if (!hasLangMod(p))
                continue;
            if (p.getNamespace() === myNsp)
                continue;
            await p.loadClasses();
        }
    },
    getEXT() { return ".tonyu"; },
    loadClasses() {
        throw new Error("Stub");
    },
};
//# sourceMappingURL=langMod.js.map