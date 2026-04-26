interface ThreadGroup {
    setThreadGroup(g: ThreadGroup): void;
    isDeadThreadGroup(): boolean;
    killThreadGroup(): void;
    objectPoolAge: any;
}
type TerminateStatus = undefined | "killed" | "exception" | "success";
type TerminateEvent = {
    status: "killed";
} | {
    status: "success";
    value: any;
} | {
    status: "exception";
    exception: Error;
};
type TerminateHandler = (st: TerminateEvent) => void;
export declare class TonyuThread implements ThreadGroup {
    Tonyu: {
        currentThread: TonyuThread | null;
        globals: {
            [key: string]: any;
        };
    };
    generator?: Generator<any>;
    private _isDead;
    private _isWaiting;
    fSuspended: boolean;
    preemptionTime: number;
    onEndHandlers: any[];
    onTerminateHandlers: TerminateHandler[];
    id: number;
    age: number;
    termStatus: TerminateStatus;
    preempted: boolean;
    retVal: any;
    lastEvent?: any[];
    lastEx?: Error;
    handleEx: any;
    _threadGroup: undefined | ThreadGroup;
    objectPoolAge: any;
    tGrpObjectPoolAge: any;
    constructor(Tonyu: {
        currentThread: TonyuThread | null;
        globals: {
            [key: string]: any;
        };
    });
    isAlive(): boolean;
    isDead(): boolean;
    isDeadThreadGroup(): boolean;
    killThreadGroup(): void;
    setThreadGroup(g: ThreadGroup): void;
    suspend(): void;
    apply(obj: any, methodName: string | Function, args?: any[]): void;
    notifyEnd(r: any): void;
    notifyTermination(tst: TerminateEvent): void;
    on(type: "end" | "success" | "terminate", f: Function): void;
    promise(): Promise<any>;
    then(succ: (retVal: any) => any, err: (a: Error) => any): Promise<any>;
    fail(err: (a: Error) => any): Promise<any>;
    waitEvent(obj: any, eventSpec: any[]): void;
    isWaiting(): boolean;
    waitFor(j: any): Promise<any>;
    wrapError(e: any): Error;
    resume(retVal: any): void;
    steps(): void | Promise<any>;
    exception(e: Error): void;
    stepsLoop(): void;
    kill(): void;
    await(p: any): Generator<any, any, unknown>;
}
export {};
