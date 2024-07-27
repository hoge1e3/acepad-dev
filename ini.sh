cd ~/sync
sh co 47b0d9fe81d480efef209cae4a62ccea94e7a88a2ed3d3808ad7d4c13e946b31

cd ~/jsmod
cp nd ~/bin/
cp bin/sync sync.js

chmod 755 ~/bin/nd
cd /tmp/
mkdir synctes
cd synctes
nd ~/jsmod/sync.js clone jsmod|less
