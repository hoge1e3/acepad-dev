cd ~/sync
sh co 25d40f9134434e5e7de94373a41a951c6cd16968124e156d3092ccf9a3f8d5ad

cd ~/jsmod
cp nd ~/bin/
cp bin/sync sync.js

chmod 755 ~/bin/nd
cd /tmp/
mkdir synctes
cd synctes
nd ~/jsmod/sync.js clone jsmod
