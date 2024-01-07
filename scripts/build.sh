#!/bin/sh

echo $DOCKERHUB_ACCESS_TOKEN | docker login -u andriihub --password-stdin

if [ $? != 0 ]; then
	exit 1
fi

imagename='andriihub/taskmanager:latest'

docker build --tag andriihub/taskmanager:latest .

if [ $? != 0 ]; then
	exit 1
fi

docker push andriihub/taskmanager:latest
