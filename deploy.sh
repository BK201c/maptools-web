#!/usr/bin/env sh

# 发生错误时终止
set -e

# 构建
yarn run build

# 进入构建文件夹
cd dist

# 如果你要部署到自定义域名
# echo 'www.example.com' > CNAME

git checkout master
git merge dev
git push

# 如果你要部署在 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# 如果你要部署在 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:BK201c/maptools-web.git master:gh-pages
