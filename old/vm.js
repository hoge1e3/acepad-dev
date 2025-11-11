#!run
// vm.js
// Minimal stack-frame VM (Node.js). Implements the spec discussed.
// Usage: node vm.js
const debug=true;
const UNINITIALIZED = { __uninitialized__: true };

class Frame {
  constructor(body = [], env = null, isCallFrame = false) {
    this.pc = 0;
    this.body = body; // array of instructions
    this.env = env; // environment object { bindings: {}, parent: env }
    this.stack = []; // value stack local to this frame
    this.isCallFrame = isCallFrame;
    // envStack allows block-scoped env push/pop without creating extra frames
    this._envStack = [];
  }
}

class VM {
  constructor(state = null) {
    if (state) {
      // (not implementing serialization here) — expecting fresh start
      Object.assign(this, state);
    } else {
      this.callstack = [];
      this.globals = { bindings: {}, parent: null };
      // push initial top-level frame
      const top = new Frame([], this.globals, true);
      this.callstack.push(top);
      // builtin table
      this.builtins = {
        '+': (vm) => {
          const f = vm._topFrame();
          const b = f.stack.pop();
          const a = f.stack.pop();
          // JS-like '+' behaviour: if either is string, concat
          if (typeof a === 'string' || typeof b === 'string') {
            f.stack.push(String(a) + String(b));
          } else {
            f.stack.push(a + b);
          }
        },
        'print': (vm) => {
          const f = vm._topFrame();
          const v = f.stack.pop();
          console.log(v);
          // keep nothing pushed
        }
      };
    }
  }

  // helper
  _topFrame() {
    if (this.callstack.length === 0) throw new Error('callstack empty');
    return this.callstack[this.callstack.length - 1];
  }

  // env helpers
  makeEnv(parent = null) {
    return { bindings: Object.create(null), parent: parent };
  }

  lookupEnvWithBinding(env, name) {
    let cur = env;
    while (cur) {
      if (Object.prototype.hasOwnProperty.call(cur.bindings, name)) return cur;
      cur = cur.parent;
    }
    return null;
  }

  // main step execution
  step() {
    const frame = this._topFrame();
    if (frame.pc < 0 || frame.pc >= frame.body.length) {
      // if out of body range: pop frame (end of function)
      this.callstack.pop();
      return false;
    }
    const instr = frame.body[frame.pc];
    // execute
    this.execute(instr, frame);
    // increment pc if frame still exists and pc not changed by jump/call/return
    const newTop = this._topFrame();
    if (newTop === frame) {
      frame.pc += 1;
    }
    if (debug) {
        console.log(...frame.stack);
    }
    return true;
  }

  run(steps = 100000) {
    let executed = 0;
    while (executed < steps && this.callstack.length > 0) {
      // safe guard: if current frame has no body (top-level), stop
      const cont = this.step();
      if (!cont) break;
      executed += 1;
    }
    return executed;
  }

  // core instruction dispatch
  execute(instr, frame) {
    const op = instr.op;
    switch (op) {
      // Stack ops
      case 'push':
        frame.stack.push(instr.value);
        break;
      case 'pop':
      case 'drop':
        frame.stack.pop();
        break;
      case 'dup': {
        const v = frame.stack[frame.stack.length - 1];
        frame.stack.push(v);
        break;
      }

      // Variable ops
      case 'declare': { // let declaration: create binding initialized to UNINITIALIZED
        const name = instr.name;
        frame.env.bindings[name] = UNINITIALIZED;
        break;
      }
      case 'load': {
        const name = instr.name;
        let envWith = this.lookupEnvWithBinding(frame.env, name);
        if (envWith) {
          const val = envWith.bindings[name];
          if (val === UNINITIALIZED) {
            throw new Error(`ReferenceError: '${name}' is uninitialized`);
          }
          frame.stack.push(val);
        } else if (Object.prototype.hasOwnProperty.call(this.globals.bindings, name)) {
          const gv = this.globals.bindings[name];
          frame.stack.push(gv);
        } else {
          throw new Error(`ReferenceError: '${name}' is not defined`);
        }
        break;
      }
      case 'store': {
        const name = instr.name;
        const val = frame.stack.pop();
        const envWith = this.lookupEnvWithBinding(frame.env, name);
        if (envWith) {
          envWith.bindings[name] = val;
        } else {
          // per spec: write into current env if not found (or ideally declaration should exist)
          frame.env.bindings[name] = val;
        }
        break;
      }

      // Control flow
      case 'jump': {
        const to = instr.to;
        frame.pc = to;
        // note: caller increments pc only if frame still top; so to avoid double increment,
        // we set pc to target and then step() will not add +1 if frame changed? We handle by
        // ensuring caller doesn't add another increment: in step(), we only increment if frame still top.
        break;
      }
      case 'jump_if_false': {
        const cond = frame.stack.pop();
        if (!cond) {
          frame.pc = instr.to;
        }
        break;
      }

      // Closures & functions
      case 'make_closure': {
        // closure: { type: 'closure', params: [...], body: [...], env: frame.env }
        const closure = {
          type: 'closure',
          params: instr.params || [],
          body: instr.body || [],
          env: frame.env
        };
        frame.stack.push(closure);
        break;
      }

      case 'call': {
        const argc = instr.argc || 0;
        // pop arguments in reverse to maintain left-to-right order
        const args = [];
        for (let i = 0; i < argc; i++) {
          // pop last arg (argN)
          args.unshift(frame.stack.pop()); // unshift to keep original order [arg1,...,argN]
        }
        const callee = frame.stack.pop();
        if (!callee || callee.type !== 'closure') {
          throw new Error('TypeError: callee is not a closure');
        }
        // create new env with parent = callee.env
        const newEnv = this.makeEnv(callee.env);
        // bind parameters
        for (let i = 0; i < (callee.params || []).length; i++) {
          const p = callee.params[i];
          newEnv.bindings[p] = args[i] !== undefined ? args[i] : undefined;
        }
        // create new frame for the call
        const newFrame = new Frame(callee.body, newEnv, true);
        this.callstack.push(newFrame);
        break;
      }

      case 'return': {
        // return value is on top of current frame.stack
        const returnValue = frame.stack.pop();
        // pop frames until and including the current call frame (the one with isCallFrame true)
        while (this.callstack.length > 0) {
          const f = this.callstack.pop();
          if (f.isCallFrame) {
            break;
          }
        }
        // caller frame should now be top
        if (this.callstack.length === 0) {
          // program finished; make a top-level frame and push return value to it
          const top = new Frame([], this.globals, true);
          top.stack.push(returnValue);
          this.callstack.push(top);
        } else {
          const caller = this._topFrame();
          caller.stack.push(returnValue);
        }
        break;
      }

      // builtin
      case 'builtin': {
        const name = instr.name;
        const fn = this.builtins[name];
        if (!fn) throw new Error(`Unknown builtin: ${name}`);
        fn(this);
        break;
      }

      // Block scope helpers (we implement block scoping by altering current frame.env,
      // not by pushing a whole new frame — this is simpler and preserves semantics)
      case 'enter_block': {
        const newEnv = this.makeEnv(frame.env);
        frame._envStack.push(frame.env);
        frame.env = newEnv;
        break;
      }
      case 'exit_block': {
        const prev = frame._envStack.pop();
        if (!prev) throw new Error('Mismatched exit_block');
        frame.env = prev;
        break;
      }

      default:
        throw new Error(`Unknown op: ${op}`);
    }
  }
}
// runner
function runProgram(program) {
  const vm = new VM();
  // place program into top frame
  const top = vm._topFrame();
  top.body = program;
  vm.run(1000);
  return vm;
}
export function main(){

    // Example program: create a closure that captures x and increments it each call.
    // Equivalent JS:
    // let x = 0;
    // const c = function() { x = x + 1; return x; };
    // print(c()); // 1
    // print(c()); // 2
    const prog = [
    { op: 'declare', name: 'x' },        // let x;
    { op: 'push', value: 0 },
    { op: 'store', name: 'x' },          // x = 0
    // create closure that captures current env
    {
        op: 'make_closure',
        params: [],
        body: [
        // body: x = x + 1; return x;
        { op: 'load', name: 'x' },
        { op: 'push', value: 1 },
        { op: 'builtin', name: '+' },
        { op: 'store', name: 'x' },
        { op: 'load', name: 'x' },
        { op: 'return' }
        ]
    },
    // duplicate closure so we can call it twice (call consumes closure)
    { op: 'dup' },
    { op: 'call', argc: 0 }, // first call -> returns 1 on caller stack
    { op: 'builtin', name: 'print' }, // prints 1
    // Now call again. (we still have one clone left because of earlier dup? Actually dup made two closures,
    // first call consumed one, second call needs a callee on stack again. For demonstration we'll push again:)
    { op: 'push', value: null }, // placeholder (we will restore closure from globals?) -> instead, simpler approach:
    // To be robust, let's create the closure into a variable 'c' instead of dup workflow.
    ];

    // Instead, a clearer demo: store closure into 'c', then call c twice and print
    const prog2 = [
    { op: 'declare', name: 'x' },        // let x;
    { op: 'push', value: 0 },
    { op: 'store', name: 'x' },          // x = 0
    {
        op: 'make_closure',
        params: [],
        body: [
        { op: 'load', name: 'x' },
        { op: 'push', value: 1 },
        { op: 'builtin', name: '+' },
        { op: 'store', name: 'x' },
        { op: 'load', name: 'x' },
        { op: 'return' }
        ]
    },
    { op: 'store', name: 'c' },          // c = closure
    // call c -> push closure then call
    { op: 'load', name: 'c' },
    { op: 'call', argc: 0 },
    { op: 'builtin', name: 'print' },
    // call c again
    { op: 'load', name: 'c' },
    { op: 'call', argc: 0 },
    { op: 'builtin', name: 'print' },
    ];

    console.log('=== running prog2 (closure test) ===');
    runProgram(prog2);

    // Additional test: block scoping
    const prog3 = [
    { op: 'declare', name: 'a' },
    { op: 'push', value: 1 },
    { op: 'store', name: 'a' },
    // enter block
    { op: 'enter_block' },
    { op: 'declare', name: 'a' },
    { op: 'push', value: 2 },
    { op: 'store', name: 'a' },
    { op: 'load', name: 'a' }, // should load inner a = 2
    { op: 'builtin', name: 'print' },
    { op: 'exit_block' },
    { op: 'load', name: 'a' }, // should load outer a = 1
    { op: 'builtin', name: 'print' }
    ];

    console.log('=== running prog3 (block scope test) ===');
    runProgram(prog3);

}