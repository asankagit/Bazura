// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
const path = require('path');

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
import React, { createElement } from 'react';
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
  <link href="styles.css" rel="stylesheet">
  <script data-ad-client="ca-pub-2317903401020318" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <meta property="og:image"  content="https://static.observableusercontent.com/thumbnail/16029014ad2d5b18c0b97a351939893d2f30a48b25a6caa7741fe22d5d30e5a1.jpg">
</head>

<body
  <div class="content">
     <div id="root">${content}</div>
     <div id="three"> Three.js rendering sample  </div>
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
  <script href="bundle.js" src="bundle.js" defer></script>
</body>
</html>`;

app.use('/bundle.js', (req, response) => {
  var filePath = path.join(__dirname, 'bundle.js');
  console.log({ filePath })
  try {
    var stat = fs.readFileSync("bundle.js");

  response.writeHead(200, {
      'Content-Type': 'text/plain',
      // 'Content-Length': stat.size
  });

  var readStream = fs.createReadStream(filePath);
  // We replaced all the event handlers with a simple call to readStream.pipe()
  readStream.pipe(response);
  } catch(e) {
    response.send(e)
  }
  
})

app.use('/public', express.static(path.resolve(__dirname, 'static_content')))
// app.use(express.static())
app.use('/', (req, res) => {
  // if (req.query.isme !== "true") { return res.send("Landing page") }
    res.send(template(renderToString(createElement(Hello, { to: req.query.to } ))))
})
app.use('/styles.css', (req, response) => {
  var filePath = path.join(__dirname, 'styles.css');
  console.log({ filePath })
  try {
    // var stat = fs.readFileSync("bundle.js");

  response.writeHead(200, {
      'Content-Type': 'text/plain',
      // 'Content-Length': stat.size
  });

  var readStream = fs.createReadStream(filePath);
  // We replaced all the event handlers with a simple call to readStream.pipe()
  readStream.pipe(response);
  } catch(e) {
    response.send(e)
  }
})

app.use("/heart-beat", (req, res) => {
  res.json({"status": "ok"});
})

exports.lambdaHandler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context)
}


exports.staticHandler = (event, context, callback) => {
  // awsServerlessExpress.proxy(server, event, context)
  const cssContents = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
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
