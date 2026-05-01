import { Program } from "./NodeTypes.js";
import { BuilderEnv, C_Meta } from "./CompilerTypes.js";
export declare function parse(klass: C_Meta, options?: {}): Program;
export declare function initClassDecls(klass: C_Meta, env: BuilderEnv): void;
declare function annotateSource2(klass: C_Meta, env: BuilderEnv): void;
export declare const annotate: typeof annotateSource2;
export {};
