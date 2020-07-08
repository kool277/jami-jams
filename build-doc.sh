#!/bin/bash
mkdir -p jams
cd userguide || exit
mkdocs build
cp site/pdf/combined.pdf ../jams/userguide.pdf