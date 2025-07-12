cd ~
cd jsmod
sync checkout
rm ~/tonyu2/acepad/setup.zip
zip -r ~/tonyu2/acepad/setup.zip . -x '*.sync*' 
cd ~/tonyu2/acepad
sync checkout
