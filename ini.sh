cd /tmp
python3 ~/bin/decode.py
1d79ce338276bfb431cd8153bb14b5b07622fa800f5cfb84848e9111d9c58f02
cd
mkdir jsmod
cd jsmod
unzip /tmp/decoded.zip
cd docker
chmod 755 bin/*
cp bin/* ~/bin/
cd ..
sync
