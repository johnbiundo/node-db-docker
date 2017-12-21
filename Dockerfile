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
#
# Running as a local container:
# docker 
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
#unevrse/node-db-docker:latest
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

EXPOSE 9999

RUN mkdir -p /etc/my_init.d
ADD startup.sh /etc/my_init.d/startup.sh
RUN chmod +x /etc/my_init.d/startup.sh

RUN mkdir /etc/service/node
ADD node.sh /etc/service/node/run
RUN chmod +x /etc/service/node/run
