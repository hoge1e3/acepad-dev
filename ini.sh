cd ~/sync
sh co 283a13ff182597fc059798e73785b48a671fdd01f325a4e93a3a067df30203f3

cd ~/jsmod
cp nd ~/bin/
cp bin/sync sync.js

chmod 755 ~/bin/nd
cd /tmp/
mkdir synctes
cd synctes
nd ~/jsmod/sync.js clone jsmod
