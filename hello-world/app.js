// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import Hello from './src/Hello';
import World from './src/World';
const express = require('express')
const fs = require('fs');
const awsServerlessExpress = require('aws-serverless-express')



const app = express()
const server = awsServerlessExpress.createServer(app)

const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
app.use(awsServerlessExpressMiddleware.eventContext())

const template = (content) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Pixellio </title>
  <link href="./static/styles.css" rel="stylesheet">
  <script data-ad-client="ca-pub-2317903401020318" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <meta property="og:image"  content="https://static.observableusercontent.com/thumbnail/16029014ad2d5b18c0b97a351939893d2f30a48b25a6caa7741fe22d5d30e5a1.jpg">
</head>
<body>
  <div class="content">
     <div id="app" class="wrap-inner">
        ${content}
     </div>
  </div>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- pixellio_adsense -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-2317903401020318"
     data-ad-slot="4706545270"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
</body
</html>`;

app.use('/', (req, res) => {
    console.log("rendertoString", renderToString(createElement(Hello)))
    console.log("templte", template(renderToString(createElement(Hello))))
    res.send(template(renderToString(createElement(Hello))))
})

exports.lambdaHandler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context)
}


exports.staticHandler = (event, context, callback) => {
  // awsServerlessExpress.proxy(server, event, context)
  const cssContents = fs.readFileSync('./styles.css', 'utf8');
  callback(null, {
    'statusCode': 200,
    "headers": {"Content-type": "text/css"},
    'body': cssContents
  })
}
// exports.lambdaHandler = function(event, context, callback){
//     const html = renderToString(createElement(Hello));

//     response = {
//         'statusCode': 200,
//         'body': JSON.stringify({
//             message: html,
//         })
//     }


//     callback(null,response)
// };
