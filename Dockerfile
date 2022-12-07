FROM public.ecr.aws/lambda/nodejs:16
COPY . / package*.json ./
RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

RUN rm -rf .aws-sam
RUN npm rebuild node-sass --force
RUN npm install --force
RUN npm run build
RUN pwd
RUN ls -la 
CMD [ ".aws-sam/build/HelloWorldFunction/app.lambdaHandler"]


# https://aws.amazon.com/blogs/aws/new-for-aws-lambda-container-image-support/