# https://gist.github.com/neuro-sys/271a61eb3ca0436a79c967572696f2c9
# https://github.com/zodern/meteor-up/issues/683

ARG FUNCTION_DIR="/hello-world"
# FROM ubuntu:20.04  as build-image
FROM nvidia/opengl:1.2-glvnd-runtime-ubuntu20.04  AS build-image
WORKDIR /usr/bin 

ARG DEBIAN_FRONTEND=noninteractive
# Create app directory
# WORKDIR /usr/src/app

# ENV NODE_PATH /usr/local/lib/node_modules
# RUN npm install --unsafe-perm --global gl


# # https://github.com/zodern/meteor-up/issues/683
RUN apt-get update -y
RUN apt-get remove -y gyp
RUN apt-get install -y curl bzip2 build-essential g++ python3 git make gcc gcc-multilib node-gyp


RUN apt-get install -y xorg xserver-xorg xvfb libx11-dev libxext-dev mesa-utils
RUN apt-get install -y pkg-config xserver-xorg-dev libxext-dev pkg-config libxi-dev libglu1-mesa-dev libglew-dev


FROM node:16.14.0 AS nodeImg
WORKDIR /usr/bin
# Tracker "idealTree" already exists https://stackoverflow.com/questions/57534295/npm-err-tracker-idealtree-already-exists-while-creating-the-docker-image-for

COPY package*.json ./ 
RUN npm install prebuild-install node-pre-gyp node-gyp -g
RUN npm install --unsafe-perm --global gl

RUN rm -rf .aws-sam
RUN npm install --force
RUN npm rebuild node-sass --force
RUN npm rebuild gl --force
# RUN npm run build
# RUN pwd
# RUN ls -la 


# # WORKDIR /aws-sam
# CMD [ "./hello-world/three_ssr.lambdaHandler"]

COPY --from=build-image . . 



FROM bengreenier/docker-xvfb:stable
WORKDIR /usr/bin

# COPY --from=nodeImg . .
COPY . .

EXPOSE 8080

CMD ["xvfb-run --auto-servernum --server-num=1 --server-args=\"-screen 1 1024x768x24\" node server.js"]
# CMD [ "node", "server.js" ]
# https://aws.amazon.com/blogs/aws/new-for-aws-lambda-container-image-support/