import sys
import json
import os
file=sys.argv[1]

if os.path.isfile(file):
    with open(file,"r") as f:
        cont=f.read()
else:
    cont=""
cmd={
    "cmd":"edit",
    "file":file,
    "content":cont
}
cmdj=json.dumps(cmd)
print(f"\x1b]10;{cmdj}\x07\n")
wrtj=input()
wrt=json.loads(wrtj)
if not "file" in wrt:
    exit()
if not "content" in wrt:
    exit()
if wrt["content"]==cont and wrt["file"]==file:
    exit()
with open(wrt["file"],"w") as f:
    f.write(wrt["content"])
