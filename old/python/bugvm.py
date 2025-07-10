from __future__ import annotations
"""
 # stack/memory operations
 0 CONST n
 1 <addr> read
 2 <val> <addr> write  -> <val>
   DROP after WRITE on end of statement!
 3 <garbage> drop ->(empty)
 4 <val> dup  -> <val> <val>
 5 <a> <b> ex  -> <b> <a>

 # controlls
 8 <addr> jp
 9 <addr> jpf
 10 <addr> call  ( or just <addr> if addr>opr_max )
 
 # arithmetic
 16 <a> <b> add -> <a+b>
 17 <a> <b> sub -> <a-b>
    neg: 0 <a> sub
 18 <a> <b> mul -> <a*b>
 19 <a> <b> divmod -> <a/b> <a%b>
    div: divmod drop
    mod: divmod ex drop
    
 # bitwise
 24 <a> <b> and -> <a&b>
 25 <a> <b> or  -> <a|b>
 26 <a> <b> xor -> <a^b>
    not: <a> -1 xor
 27 <a> <b> shu -> a << b  or a >>> -b
 28 <a> <b> shs -> a << b  or a >> -b
 
 # compare
 32 <a> <b> eq
    ne: <a> <b> eq not
 33 <a> <b> gt
    le: <a> <b> gt not
 34 <a> <b> ge
    lt: <a> <b> ge not

 opr_max
 
MEMMAP:
 0 PC
   getpc: 0 read
   setpc: <addr> 0 write
 1 SP
   getsp: 1 read
   setsp: <addr> 1 write
 2 BP(*)
   getbp: 2 read
   setbp: <addr> 2 write
   read (BP+n): 
          getbp 
          push n
          add
          read
   write (BP+n):
          <stack top is val> 
          getbp 
          push n
          add
          write
   stack frame
      <args>...<args> <retaddr> <savebp> <savesp> <-bp <locals>...<locals>
   call sequence
"""
from abc import ABC, abstractmethod

CONST=0
READ=1
WRITE=2
DROP=3
DUP=4
EX=5
JP=8
JPF=9
CALL=10
RET=JP

ADD=16
SUB=17
MUL=18
DIV=19
AND=24
OR=25
XOR=26
SH=27
EQ=32
GT=33
GE=34

DEBUG=62
HALT=63

OPR_MAX=64

MEM_PC=0
MEM_SP=1

def zeroArray(n):
   a=[]
   for i in range(n):
      a.append(HALT)
   return a
class Device(ABC):
   @abstractmethod
   def inp(self, addr: int, mem: MappedMem)->int:
      pass
   @abstractmethod
   def out(self, addr: int, val: int, mem: MappedMem):
      pass
class MappedMem:
   def __init__(self, size=65536):
      self.mem=zeroArray(size)
   def install(self, _range, dev: Device):
      if isinstance(_range, int):
         _range=range(_range,_range+1)
      for i in _range:
         self.mem[i]=dev
   def __getitem__(self, i: int):
      if isinstance( self.mem[i], Device):
         return self.mem[i].inp(i, self)
      else:
         return self.mem[i]
   def __setitem__(self, i, val: int):
      if isinstance( self.mem[i], Device):
         self.mem[i].out(i, val, self)
      else:
         self.mem[i]=val
class IO(Device):
   start=16
   def inp(self, addr: int, mem: MappedMem)->int:
      if addr==IO.start:
         return int(input("in? "))
   def out(self, addr: int, val: int, mem: MappedMem):
      if addr==IO.start:
         print(val)

class VM:
   SP_START=60000
   def __init__(self):
      self.mem=MappedMem(65536)
      self.pc=OPR_MAX
      self.sp=VM.SP_START
      self.halted=False
      self.mem.install(IO.start, IO())
   @property
   def sp(self)->int:
      return self.mem[MEM_SP]
   @sp.setter
   def sp(self, value: int):
      self.mem[MEM_SP]=value
   @property
   def pc(self)->int:
      return self.mem[MEM_PC]
   @pc.setter
   def pc(self, value: int):
      self.mem[MEM_PC]=value
   def push(self, value: int):
      self.mem[self.sp]=value
      self.sp-=1
   def pop(self)->int:
      self.sp+=1
      return self.mem[self.sp]
   def step(self):
      opr=self.mem[self.pc]
      if opr<len(Ops.map):
         f=Ops.map[opr]
         if isinstance(f,int):
            raise Exception(f"Invalid code {opr}")
         f(self)
      else:
         #CALL
         self.push(self.pc+1)
         self.pc=opr
   def steps(self, debug=False):
      while not self.halted:
         if debug:
            self.debug()
         self.step()
   def debug(self):
      print("----DEBUG----")
      print("0: ",end=" ")
      for i in range(16):
         print(self.mem[i], end=" ")
      print(f"\n{self.pc-16}:", end=" ")
      for i in range(16):
         print(self.mem[self.pc-16+i], end=" ")
      print()
      print(f"{self.pc}->", end="")
      for i in range(16):
         print(self.mem[self.pc+i], end=" ")
      print()
      print("Stack:",end=" ")
      for i in range(self.SP_START, self.sp,-1):
         print(self.mem[i],end=" ")
      print() 

      
#o.split("\n").map(s=>s.replace(/=.*/,"")).map(s=>`def ${s}(vm: VM):\n   vm.pc+=1`).join("\n")
class Ops:
   map=zeroArray(OPR_MAX)
   def CONST(vm: VM):
      vm.push(vm.mem[vm.pc+1])
      vm.pc+=2
   def READ(vm: VM):
      vm.push(vm.mem[vm.pop()])
      vm.pc+=1
   def WRITE(vm: VM):
      addr=vm.pop()
      val=vm.pop()
      vm.mem[addr]=val
      vm.pc+=1
      vm.push(val)
   def DROP(vm: VM):
      vm.pop()
      vm.pc+=1
   def DUP(vm: VM):
      val=vm.pop()
      vm.push(val)
      vm.push(val)
      vm.pc+=1
   def EX(vm: VM):
      b=vm.pop()
      a=vm.pop()
      vm.push(a)
      vm.push(b)
      vm.pc+=1
   def JP(vm: VM):
      vm.pc=vm.pop()
   def JPF(vm: VM):
      to=vm.pop()
      cond=vm.pop()
      if cond:
         #print("Jump true")
         vm.pc+=1
      else:
         vm.pc=to
         #print("Jump false to:", vm.pc)
   def CALL(vm: VM):
      to=vm.pop()
      vm.push(vm.pc+1)
      vm.pc=to
   def ADD(vm: VM):
      b=vm.pop()
      a=vm.pop()
      vm.push(a+b)
      vm.pc+=1
   def SUB(vm: VM):
      b=vm.pop()
      a=vm.pop()
      vm.push(a-b)
      vm.pc+=1
   def MUL(vm: VM):
      b=vm.pop()
      a=vm.pop()
      vm.push(a*b)
      vm.pc+=1
   def DIV(vm: VM):
      b=vm.pop()
      a=vm.pop()
      vm.push(a//b)
      vm.push(a%b)
      vm.pc+=1
   def AND(vm: VM):
      b=vm.pop()
      a=vm.pop()
      vm.push(a&b)
      vm.pc+=1
   def OR(vm: VM):
      b=vm.pop()
      a=vm.pop()
      vm.push(a|b)
      vm.pc+=1
   def XOR(vm: VM):
      b=vm.pop()
      a=vm.pop()
      vm.push(a^b)
      vm.pc+=1
   def SH(vm: VM):
      b=vm.pop()
      a=vm.pop()
      if b>0:
         a=a<<b
      else:
         a=a>>(-b)   
      vm.push(a)
      vm.pc+=1
   def EQ(vm: VM):
      b=vm.pop()
      a=vm.pop()
      vm.push(1 if a==b else 0)
      vm.pc+=1
   def GT(vm: VM):
      b=vm.pop()
      a=vm.pop()
      vm.push(1 if a>b else 0)
      vm.pc+=1
   def GE(vm: VM):
      b=vm.pop()
      a=vm.pop()
      vm.push(1 if a>=b else 0)
      vm.pc+=1
   def DEBUG(vm: VM):
      vm.debug()
      vm.pc+=1
   def HALT(vm: VM):
      vm.halted=True
      #raise Exception(f"VM Stopped at {vm.pc}")
Ops.map[CONST]=Ops.CONST
Ops.map[READ]=Ops.READ
Ops.map[WRITE]=Ops.WRITE
Ops.map[DROP]=Ops.DROP
Ops.map[DUP]=Ops.DUP
Ops.map[EX]=Ops.EX
Ops.map[JP]=Ops.JP
Ops.map[JPF]=Ops.JPF
Ops.map[CALL]=Ops.CALL
Ops.map[ADD]=Ops.ADD
Ops.map[SUB]=Ops.SUB
Ops.map[MUL]=Ops.MUL
Ops.map[DIV]=Ops.DIV
Ops.map[AND]=Ops.AND
Ops.map[OR]=Ops.OR
Ops.map[XOR]=Ops.XOR
Ops.map[SH]=Ops.SH
Ops.map[EQ]=Ops.EQ
Ops.map[GT]=Ops.GT
Ops.map[GE]=Ops.GE
Ops.map[DEBUG]=Ops.DEBUG
Ops.map[HALT]=Ops.HALT