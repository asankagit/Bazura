'use strict';
// const x = require("./hello-world/three_ssr")
const preGl = require('gl')
const gl = preGl(10,10, { preserveDrawingBuffer: true });

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  console.log({ gl })
  res.send('Hello World');
});

app.listen(PORT, HOST, () => {
  console.log({ gl })
  console.log(`Running on http://${HOST}:${PORT}`);
});