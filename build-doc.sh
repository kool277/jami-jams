#!/bin/bash
mkdir -p jams
cd userguide || exit
/var/lib/jenkins/.local/bin/mkdocs build
cp site/pdf/combined.pdf ../jams/userguide.pdf