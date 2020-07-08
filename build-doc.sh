#!/bin/bash
mkdir -p jams
cd userguide || exit
/var/lib/jenkins/.local/bin/mkdocs build || exit 0
cp site/pdf/combined.pdf ../jams/userguide.pdf