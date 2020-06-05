#!/bin/bash
#
cd /opt/spotnik/gui

echo \nDébut Mise à Jour du GUI\n
echo arrêt du GUI
echo make stop
#make stop

echo  \nmise à jour à partir de GitHub
echo git pull
#git pull

echo \nInstallation et Compilation
echo make
#make

echo \nDémarrage du GUI
echo make start
#make start

echo \nMise à Jour GUI terminée.
return 0
