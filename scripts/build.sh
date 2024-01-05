#!/bin/sh

echo $DOCKERHUB_ACCESS_TOKEN | docker login -u andriihub --password-stdin

if [ $? != 0 ]; then
	echo 'Login failed'
	exit 1
fi

docker build --tag andriihub/taskmanager:latest .

if [ $? != 0 ]; then
	echo 'Build failed'
	exit 1
fi

docker push andriihub/taskmanager:latest
