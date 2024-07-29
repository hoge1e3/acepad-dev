cd ~/sync
sh co dc24ba8961e73314cf760c481ba62b1a7f4e1b3674f8fb26ec8d06a885b75d6f

#cp nd ~/bin/
cp ~/jsmmod/bin/sync ~/jsmod/sync.js
#chmod 755 ~/bin/nd
cd /tmp/
rm -rf synctes
mkdir synctes
cd synctes
nd ~/jsmod/sync.js clone jsmod

#cd ~/node_modules/@hoge1e3/fs-nw
#cp ~/jsmod/tesfs.js test.mjs
#npm run test-node
#ed ~/node_modules/@hoge1e3/fs-nw/src/NativeFS.js
