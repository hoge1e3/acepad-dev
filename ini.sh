cd ~/sync
sh co 9c87698acb358aa18cf2418faf839dcd1745066ddecf4b3b0e80f6702f272540

cd ~/jsmod
cp nd ~/bin/
cp bin/sync sync.js

chmod 755 ~/bin/nd
cd /tmp/
mkdir synctes
cd synctes
nd ~/jsmod/sync.js clone jsmod
