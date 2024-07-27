cd ~/sync
sh co 5a41393d525bbf081a5a3ee6ddb4035bbba30e417487fcefab2e760ffa41022a

cd ~/jsmod
cp nd ~/bin/
cp bin/sync sync.js

chmod 755 ~/bin/nd
cd /tmp/
mkdir synctes
cd synctes
nd ~/jsmod/sync.js clone jsmod|less
