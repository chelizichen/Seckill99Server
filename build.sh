#!/bin/bash  

# if permission denied
# run script with ` chmod +x build.sh ` 
readonly ServerName="Seckill99Server"

# rm
rm ./$ServerName.tar.gz ./sgrid_app

# compile
GOOS=linux GOARCH=amd64 go build -o sgrid_app

# build
tar -cvf $ServerName.tar.gz ./sgrid.yml ./sgrid_app ./dist
