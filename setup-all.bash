#!/bin/bash
node ukodi-training-setup.js create $1
node ukodi-training-setup.js milestones $1
mkdir ODP-Group$1
cp files_template/README.md ODP-Group$1
cp files_template/LICENSE ODP-Group$1
cd ODP-Group$1
git init
git add .
git commit -m "Setup commit from training template (base)"
git remote add origin git@github.com:ukodi-training/ODP-Group$1.git
git push -u origin master
git branch gh-pages
git checkout gh-pages
cd ..
cp -r files_template/* ODP-Group$1/
cd ODP-Group$1
git add .
git commit -m "Setup commit from training template (gh-pages)"
git push -u origin gh-pages
cd ..
rm -fR ODP-Group$1
