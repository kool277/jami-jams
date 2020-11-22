#!/bin/bash
mkdir -p jams
cd userguide || exit
cd src/mkpdfs-mkdocs-plugin || ( echo 'Cannot cd to src/mkpdfs-mkdocs-plugin' && exit )
git pull || ( echo 'Error on git pull' && exit )
pip install npm || ( echo 'Error installing npm pip module' && exit )
python design.py || ( echo 'Error exexuting design.py ' && exit )
cd ../.. || ( echo 'Error changing directory to userguide ' && exit )
/var/lib/jenkins/.local/bin/mkdocs build || exit 0
cp site/pdf/combined.pdf ../jams/userguide.pdf