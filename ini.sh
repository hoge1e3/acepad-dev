cd ~/sync
sh co 2ea3ba62dced489714704763a256a69acfe5c666c27f26751947c6c83a4ce6eb

cd ~/jsmod
cp nd ~/bin/
cp bin/sync sync.js

chmod 755 ~/bin/nd
cd /tmp/
mkdir synctes
cd synctes
nd ~/jsmod/sync.js clone jsmod|less
