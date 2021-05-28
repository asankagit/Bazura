FROM amazon/aws-lambda-nodejs:12
RUN mkdir -p /opt/app
COPY . /opt/app
WORKDIR /opt/app
COPY app.js package*.json ./
RUN npm install
CMD [ ".aws-sam/build/HelloWorldFunction/app.lambdaHandler" ]