import { DependencySpec, ProjectOptions } from "../lang/CompilerTypes.js";
import { DirBasedCore, DirBasedOptions, IProject, IProjectCore } from "./projectTypes.js";
export type DependencyResolver = (prj: IProject, spec: DependencySpec) => IProject | undefined;
export type ProjectFunc = (params: any) => IProject;
export declare const addDependencyResolver: (f: DependencyResolver) => void;
export declare const addType: (n: string, f: ProjectFunc) => void;
export declare const fromDependencySpec: (prj: IProject, spec: DependencySpec) => IProjectCore;
export declare const create: (type: string, params: any) => IProjectCore;
export declare class ProjectCore implements IProjectCore {
    getPublishedURL(): string;
    getOptions(): ProjectOptions;
    getName(): string;
    getDependingProjects(): IProject[];
    include<T>(mod: T): T & this;
    delegate(obj: any): any;
}
export declare const createCore: () => ProjectCore;
export declare const createDirBasedCore: (params: DirBasedOptions) => DirBasedCore;
