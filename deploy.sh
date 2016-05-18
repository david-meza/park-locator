#!/bin/bash
# Deploying from master branch to gh-pages branch

echo 'Welcome to the future!'
git checkout master
git status
grunt build
git checkout gh-pages
git pull origin master
cp -R /dist ./
git status
git add -A
git commit -m 'Update dist'
git push origin gh-pages
git checkout master
