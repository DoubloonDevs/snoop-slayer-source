find ./app.nw 
if [ "$?" == "0" ]
	then
	rm -rf app.nw
fi
zip -r -X app.nw .
cd ..
dir_name="${PWD##*/}"
cd ..
cp -R ./nwjs.app ./$dir_name
if [ "$?" != "0" ]
	then
	echo "[ERROR] Package not found! Place Node Webkit above app root directory."
	exit
fi 
cd ./$dir_name
mv ./bin/app.nw ./nwjs.app/Contents/Resources
cp ./bin/nw.icns ./nwjs.app/Contents/Resources
find ./$dir_name.app
if [ "$?" == "0" ]
	then
	rm -rf ./$dir_name.app
	mv ./nwjs.app ./$dir_name.app
	else
	mv ./nwjs.app ./$dir_name.app
fi
echo "[SUCCESS] $dir_name packaged successfully!"