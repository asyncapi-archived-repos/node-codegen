#! /bin/bash

git remote add dokku dokku@{{asyncapi.host}}:{{kebabcase asyncapi.info.title}}
git push dokku master
