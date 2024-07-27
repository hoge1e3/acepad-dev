cd ~/sync
sh co 39e145f4294ae057aa28459c72e2059f33c29098e71bf4a86d6980a786bf4a7a

cd ~/jsmod
cp nd ~/bin/
cp bin/sync sync.js

chmod 755 ~/bin/nd
cd /tmp/
mkdir synctes
cd synctes
nd ~/jsmod/sync.js clone jsmod
