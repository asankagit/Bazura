# https://gist.github.com/neuro-sys/271a61eb3ca0436a79c967572696f2c9
# https://github.com/zodern/meteor-up/issues/683

FROM node:16.14.0
ENV NODE_PATH /usr/local/lib/node_modules
# RUN npm install --unsafe-perm --global gl

COPY . / package*.json ./


# https://github.com/zodern/meteor-up/issues/683
RUN apt-get update -y
RUN apt-get remove -y gyp
RUN apt-get install -y curl bzip2 build-essential g++ python git make gcc gcc-multilib node-gyp
RUN apt-get install -y pkg-config xserver-xorg-dev libxext-dev pkg-config libxi-dev libglu1-mesa-dev libglew-dev
RUN npm install prebuild-install node-pre-gyp node-gyp -g
RUN npm install --unsafe-perm --global gl

RUN rm -rf .aws-sam
RUN npm install --force
RUN npm rebuild node-sass --force
# RUN npm rebuild gl --force
RUN npm run build
RUN pwd
RUN ls -la 


# WORKDIR /aws-sam
CMD [ "./hello-world/three_ssr.lambdaHandler"]


# https://aws.amazon.com/blogs/aws/new-for-aws-lambda-container-image-support/