FROM debian:stable
WORKDIR /usr/bin
RUN apt-get update -y \
  && apt-get install --no-install-recommends -y xvfb libgl1-mesa-dri \
  && rm -rf /var/lib/apt/lists/*

RUN apt-get update -y
RUN apt-get remove -y gyp
RUN apt-get install -y curl bzip2 build-essential g++ python3 git make gcc gcc-multilib node-gyp

RUN apt-get update && apt-get install -y curl sudo
RUN curl -s https://deb.nodesource.com/setup_16.x | bash
RUN apt-get install -y nodejs

COPY . .
COPY package*.json ./
COPY webpack.config.js ./

# newly added
RUN rm -rf .aws-sam
RUN npm install --force
RUN npm rebuild gl --force
# newly added
RUN npm run build



COPY server.js server.js
COPY xvfb-startup.sh ./
# COPY xvfb-startup.sh .

RUN sed -i 's/\r$//' xvfb-startup.sh
ARG RESOLUTION="1920x1080x24"
ENV XVFB_RES="${RESOLUTION}"
ARG XARGS=""
ENV XVFB_ARGS="${XARGS}"
EXPOSE 8080
ENTRYPOINT ["/bin/bash", "xvfb-startup.sh"]
# CMD ["node", "server.js"]
# newly added
CMD [ "/bin/bash", "ls -la" ]
CMD [ "node", ".aws-sam/build/HelloWorldFunction/app.js" ]

# Build : sudo docker build . -t my-x11-app
# Run: sudo docker run -p8080:8080 -it --name my-running-app my-x11-app