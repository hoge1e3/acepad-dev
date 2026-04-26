import { DirBasedMod, IProject } from "./projectTypes.js";
export declare function isDirBasedProject(prj: IProject): prj is IProject & DirBasedMod;
export declare const create: (params: any) => import("./projectTypes.js").IProjectCore;
