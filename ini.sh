cd ~/sync
sh co 11c956f496474fd0686aaea4e461de604db9b02941eeee3ab0c678328236a9cf

cd ~/jsmod
cp nd ~/bin/
cp bin/sync sync.js

chmod 755 ~/bin/nd
cd /tmp/
mkdir synctes
cd synctes
nd ~/jsmod/sync.js clone jsmod|less
