# Dockerfile for node-db-docker
#
# Build Dependencies:
#  
# Runtime Dependencies:
# 	Container Links
#
# 	Environment Variables
# 	- Expects a TEST_DB_HOST env variable
#   e.g.,
# 		docker run --rm -d \
#                --env TEST_DB_HOST=unv-test-aux.unevrse.com \
#                --env TEST_DB_PASSWORD=unevrse \
#                --env TEST_DB_USER=unevrse \
#                --env TEST_DB_NAME=unvprod \
#                -p 5991:5991 \
#                unevrse/node-db-docker:v1
#
# Building:
#   Build with
#     docker build -t unevrse/node-db-docker:v1 . (use appropriate version tag)
#
# Running as a service in docker cloud
# 
# docker service create \
#--name node-db \
#--publish published=80,target=9999 \
#--publish published=443,target=9999 \
#--env TEST_DB_HOST=dockertest1.c8wdthoekgha.us-west-1.rds.amazonaws.com \
#--env TEST_DB_NAME=unvtest \
#--env TEST_USER=unevrse \
#--env TEST_PASSWORD='!Unevrse1' \
#--with-registry-auth \
#--label com.docker.aws.lb.arn="arn:aws:acm:us-west-1:105220694203:certificate/8e568a60-6eba-423d-92ad-aa87fe00c75c" \
#
######################################################
# BUILD
######################################################
#unevrse/node-db-docker:latest
#
FROM  phusion/baseimage:0.9.22
MAINTAINER john@unevrse.com

# Start phusion init system
CMD ["/sbin/my_init"]

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set up for node install
ENV NODE_VERSION=8.9.3
ENV NODE_ENV='production'
ENV NVM_DIR=/usr/local/nvm

# Install NVM
RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash

# Install and set up Node
RUN source $NVM_DIR/nvm.sh \
  && nvm install $NODE_VERSION \
  && nvm alias default $NODE_VERSION \
  && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

ENV UNV_ROOT='/' \
    UNV_NAME='/test.js' \
    UNV_VERSION='1.1' \
    NODE_ENV='production' \
    UNV_PORT=8888 

WORKDIR $UNV_ROOT
COPY . .
RUN npm install

# Copy files not created in dist folder by grunt build

EXPOSE $UNV_PORT

RUN mkdir /etc/service/node
ADD docker-bin/node.sh /etc/service/node/run
RUN chmod +x /etc/service/node/run
