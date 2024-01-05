#!/bin/sh

echo $DOCKERHUB_ACCESS_TOKEN || docker login -u dandriihub --password-stdion

echo $?
