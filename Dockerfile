FROM amazon/aws-lambda-nodejs:12
RUN mkdir -p /opt/app
COPY . /opt/app
WORKDIR /opt/app
COPY hello-world/app.js package*.json ./
RUN npm install
RUN npm run build
CMD [ ".aws-sam/build/HelloWorldFunction/app.lambdaHandler" ]