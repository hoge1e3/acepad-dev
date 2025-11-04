# Execution context

- Execution context is Array(stack) of Frames
- each Frame: 
   - stack (of values)
   - binding
      - Binding is key-value and parent Binding.
   - code
   - program counter(of code)

# elements of codes

## Legends
- {stack state} code
  - example ( values_in_stack code // corresponding-js-code )

## Literals
- '`literal`
   - 'abc  // "abc"
- non-string values treats as literal(push the value)

## Array and object Literals
- {value}*`length` [`length`]
   - 1 10 100 [3]  //[1,10,100]
- ({key} {value})*`length` {`length`}
   - "x" 3 "y" 4 {2}  // {x:3,y:4}
- {a1} {a2} [...]
   - [1,10] [100,1000] [...] //[1,10,100,1000]

## local variables
local variables are accessed via bindings.

- `localName`
   - x  // x
- `level`^`localName`
   - 1^x   // {let x=10; {x;} }
- {newval} `localName`=
   - 10 x=  // x=10
- {newval} `level^`localName`=
   - 20 1^x=   // {let x; {x=20;} }
- (also += -= etc)
- ({localName} {value})*`n` let(`n`)= 
   - "x" 0 "y" "uninit" let(2) // let x=0,y;
- "uninit"
   - specal value for uninitialized value.

## Field access

- {obj} .`fieldName`
   - obj .x   // obj.x 
- {obj} {newval} .`fieldName`=
   - obj 5 .x= // obj.x=5
- (also += -= etc)
- {obj} []
   - obj "my-val" []  // obj["my-val"]
- {obj} {newval} []=
   - obj "my-val" 5 []=  // obj["my-val"]=5
- (also += -= etc)

# Call

- {func} {arg}*`arity` (`arity`)
   - f 10 50 (2) // f(10,50)
- {func} {args} (...)
   - f [10,50] (...) // f(10,50)
- {obj} .`methodName`(`arity`)
   - obj 1 10 .foo(2)  // obj.foo(1,10)
- {obj} .`methodName`(...)
   - obj [1,10] .foo(...)  // obj.foo(1,10)

- {obj} {arg}*`arity` [](`arity`)
   - obj "go-up" 20 [](1) // `obj["go-up"](20)`
- {obj} {args} [](...)
   - obj "go-up" [20] [](...) // `obj["go-up"](20)`
- {Class} {arg}*`arity` new(`arity`)
   - DOMElement "div" new(1) // new DOMElement("div")
- {Class} {args} new(...)


# binary operators
- \+
   - 2 3 + //2+3
(and other binary operators)

# Increments and Decrements
- `localName`++
  - x++
- `level`^`localName`++
  - 1^x++  // {let x=0;{x++;}}
- .`fieldName`++
  - obj .x++  // obj.x++
- []++
  - obj "a-b" ++[] // obj["a-b"]++
- ++`localName`
  - ++x
- ++`level`^`localName`
  - ++1^x
- ++.`fieldName`
  - obj ++.x // ++obj.x
- ++[]
  - obj "a-b" ++[] // ++obj["a-b"]
- (same as --)

# unary operators
- {num} (-)
  - x (-)  //-x
- typeof
- await
- and other unary operatores

# Control structure

- {cond} {then-block} {else-block} if
   - "x" 0 "<" ["x" "(-)"] ["x"] if  // x<0 ?  -x : x
   - cond is boolean value
   - then-block, else-block is array of codes
- {cond} {loop} while
   - ["x", 10, "<"] ["x++"] while // while(x<10)x++;
- {loop} {code} do_while
- {init} {cond} {next} {loop} for
   - ["i", 0, "let(1)="] ["i", 10, "<"] ["i++"] ["console", "i", ".log(1)"] for // for (let i=0;i<10;i++) console.log(i);
- {value} return
   - {value} "return" // return value;

## function (closure)
- {args} {code} function
   - ["x","y"] ["x", "y", "+", "return"] function // function(x,y){return x+y;}
- {args} {code} =>
   - ["x","y"] ["x", "y", "+"] => // (x,y)=>x+y
- function(closure) is binding+argNames+code
   - When a function is called, new binding having the binding of the function is parent is generated.
