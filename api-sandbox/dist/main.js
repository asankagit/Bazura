 (()=>{var t={};(()=>{var o=t;const e=process.env.DEFAULT_TIMEOUT;o.sandboxHandler=async t=>{if("POST"!==t.httpMethod)throw new Error(`postMethod only accepts POST method, you tried: ${t.httpMethod} method.`);const o=JSON.parse(t.body);return o.id,o.name,await docClient.put(params).promise(),{statusCode:200,body:JSON.stringify({body:o,defaultTimeout:e})}}})(),module.exports.main=t})();
//# sourceMappingURL=main.js.map