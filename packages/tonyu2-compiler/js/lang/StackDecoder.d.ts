import { NullableMappedPosition, Position, SourceMapConsumer } from "source-map";
import { SourceFile } from "./SourceFiles.js";
declare const _default: {
    decode(e: Error): Promise<string[] | StackTrace.StackFrame[]>;
    originalPositionFor(sf: SourceFile, opt: Position & {
        bias?: number;
    }): Promise<NullableMappedPosition>;
    getSourceMapConsumer(sf: SourceFile): Promise<SourceMapConsumer>;
};
export default _default;
