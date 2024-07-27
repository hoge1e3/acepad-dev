cd ~/sync
sh co 16f2e99c17b70adc980c5c8fcb6728c53c79e32c540ace3897b142f3064f9d2b


cd ~/node_modles/@hoge1e3/nw-fs
cp ~/jsmod/tesfs.js test.mjs
npm run test-node

exit


cp nd ~/bin/
cp bin/sync sync.js

chmod 755 ~/bin/nd
cd /tmp/
mkdir synctes
cd synctes
nd ~/jsmod/sync.js clone jsmod|less
