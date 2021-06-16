FROM amazon/aws-lambda-nodejs:12
COPY hello-word/app.js package*.json ./
RUN npm install
RUN npm run build
CMD [ ".aws-sam/build/HelloWorldFunction/app.lambdaHandler"]


# https://aws.amazon.com/blogs/aws/new-for-aws-lambda-container-image-support/