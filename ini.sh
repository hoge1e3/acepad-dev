cd ~/sync
sh co 82a382b06615bfb45f4ea17219fe27ac51088ea2052cb700932690769854ebc4

cd ~/jsmod
cp nd ~/bin/
cp bin/sync sync.js

chmod 755 ~/bin/nd
cd /tmp/
mkdir synctes
cd synctes
nd ~/jsmod/sync.js clone jsmod|less
