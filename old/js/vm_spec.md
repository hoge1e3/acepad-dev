これは、JavaScriptをシミュレートするスタックマシンの仕様を書いたものです。こちらについてわかりにくい点や不足している点を指摘してください。
# JS-like Virtual Machine Specification (Draft)

This document consolidates the VM specification discussed so far.
*(JSON-serializable, pausable/resumable, non-recursive call execution)*

This specification describes a small virtual machine designed to be:

-   fully representable in JSON
-   easy to implement in JavaScript, Python, PHP, and similar languages
-   non-recursive (function calls use an explicit call stack)
-   pausable and resumable at any instruction
-   capable of representing closures and lexical environments

# Requirement to host languages

- The Host language should be able to:
  - Parse/stringify JSON 
  - Represent JSON object 
  - Have Garbage collection feature

# Data Model

## Values

All VM values are JSON-serializable:

-   null, boolean, number, string
-   arrays and objects
-   closures (see below)

## Closure Representation

A closure is a JSON object:

    {
      "type": "closure",
      "params": ["x", "y"],
      "body": [...],
      "env": { "x": 1, "y": 2 }
    }

Where:

-   params --- list of parameter names\
-   body --- list of instructions\
-   env --- captured environment (a plain object)

# VM State

A VM execution state is:

    {
      "callstack": [ Frame, Frame, ... ],
      "globals": { ... }
    }

## Frame

Each call frame contains:

    {
      "pc": 0,
      "body": [...],
      "env": { ... },
      "stack": []
    }

# Instruction Set

All instructions are JSON objects:

    { "op": "instructionName", ... }

## Stack Operations

-   `{ "op": "push", "value": X }`
-   `{ "op": "pop" }`
-   `{ "op": "dup" }`

## Variable Access

-   `{ "op": "load", "name": "x" }`
-   `{ "op": "store", "name": "x" }`

## Control Flow

-   `{ "op": "jump", "to": N }`
-   `{ "op": "jump_if_false", "to": N }`

## Closures & Functions

### Make a closure

    {
      "op": "make_closure",
      "params": ["x"],
      "body": [...]
    }

### Call

    { "op": "call", "argc": N }

### Return

    { "op": "return" }

## Built-in Operators

Example:

    { "op": "builtin", "name": "+" }

# Execution Loop (Pausable)

    while (steps < limit && callstack not empty) {
        frame = top(callstack)
        instr = frame.body[frame.pc]
        execute(instr)
        frame.pc++
        steps++
    }

# Pausing and Resuming

## Pause

    vm.run(100)
    (save vm.state)

## Resume

    vm = new VM(state)
    vm.run(100)


# Execution context

- Execution context is Array(stack) of Frames
- each Frame: 
   - stack (of values)
   - binding
      - Binding is key-value and parent Binding.
   - code
   - program counter(of code)

# Objects and References
- All objects and arrays are passed **by reference**.
- No separate heap structure is required (the host language’s GC handles allocation).
- Environments (frames) are normal objects with parent links.

---

# Environments and Frames
## Environment Structure
Each frame has:
- `env`: a dictionary mapping variable names to values.
- `parent`: link to parent environment (or `null`).

### Frame Creation Rules
- **Function Call Frame**:  
  New frame with `parent = closure.env`.

- **Block Scope Frame** (for `let`):  
  New frame with `parent = current_frame.env`.

### Variable Initialization
- Only `let` is supported (no `var`/`const` for now).
- `let` variables are created **at block entry** and initialized to a special `undefined` value.
- Later writes overwrite this entry.

---

## Closures
A closure contains:
- `code`: pointer to function body (instruction index range).
- `env`: the environment captured at creation time (i.e., the current frame’s environment).

Closures must be created **before evaluation of arguments** (JS‑like left‑to‑right evaluation).

---

## Stack Behavior
- Stack holds values needed for evaluation.
- `pop` discards the top element (may rename as `drop`).
- Function call pushes:
  - evaluated arguments
  - evaluated closure
- Return:
  - destroys all frames up to the callee’s call frame
  - leaves the return value on the stack of the caller frame.

---

## Return Semantics
- `return` unwinds frames until reaching the frame where the closure was invoked.
- Execution resumes at the caller, with the return value on the stack.

---

## Instruction Set (Current Draft)

### Stack Operations
- **PUSH_CONST value** – Push literal.
- **POP** – Discard top of stack.
- **LOAD name** – Look up variable through env chain.
- **STORE name** – Write top of stack to nearest env containing the binding.

### Environment Operations
- **ENTER_BLOCK** – Create new frame, initialize block `let` variables to undefined.
- **EXIT_BLOCK** – Destroy current frame.

### Closure and Function Call
- **MAKE_CLOSURE addr** – Create closure with captured env.
- **CALL argc** – Pop `argc` arguments and closure, create call frame, jump to function.
- **RETURN** – Unwind frames to caller; push return value.

(Additional instructions to be extended later.)

---

## Evaluation Order
- Must match JavaScript as closely as practical.
- Closure creation occurs before argument evaluation (“closure on stack first”).

---

## Memory Model
- No explicit heap needed.
- Objects and arrays remain strong references held by env or stack.
- Serialization will be addressed separately.

---

End of draft.
