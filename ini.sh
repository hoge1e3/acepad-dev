cd ~/sync
sh co f70aac62e013a0cadd0a1a428b9c7646b9d2110e67bc6ce32815ad9eeb887ba7

cd ~/jsmod
cp nd ~/bin/
cp bin/sync sync.js

chmod 755 ~/bin/nd
cd /tmp/
mkdir synctes
cd synctes
nd ~/jsmod/sync.js clone jsmod
