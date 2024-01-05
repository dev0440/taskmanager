#!/bin/sh

echo $DOCKERHUB_ACCESS_TOKEN || docker login -u andriihub --password-stdion
