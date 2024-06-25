import sys
import json
file=sys.argv[1]
with open(file,"r") as f:
    cont=f.read()
cmd={
    "cmd":"edit",
    "file":file,
    "content":cont
}
cmdj=json.dumps(cmd)
print(f"\x1b]10;{cmdj}\x07\n")
wrtj=input()
wrt=json.loads(wrtj)
with open(file,"w") as f:
    f.write(wrt.content)
