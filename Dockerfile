# Dockerfile for node-db-docker
#
# Build Dependencies:
#  - Expects startup.sh startup script to be present in build dir
# Runtime Dependencies:
# 	Container Links
#
# 	Environment Variables
# 	- Expects a TEST_DB_HOST env variable
#   e.g.,
# 		docker run --rm -it \                   # for interactive testing; for deploy, use -d
#                --env TEST_DB_HOST=unv-test-aux 
#
#
# Building:
#   Build with
#     docker build -t unvjohn/node-db-docker . (use appropriate version tag)
#
FROM  phusion/passenger-nodejs

MAINTAINER john@unevrse.com

ENV HOME /root 

# set automatically by phusion:
# ENV NODE_ENV='production'

CMD ["/sbin/my_init"]

WORKDIR test
COPY . .
RUN npm install

RUN mkdir -p /etc/my_init.d
ADD startup.sh /etc/my_init.d/startup.sh

RUN mkdir /etc/service/node
ADD node.sh /etc/service/node/run
