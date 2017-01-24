const express = require('express');
const superagent = require('superagent');
const app = express();

const apiUrl = process.env.API_URL;
const logStream = process.env.LOG_STREAM;

require('now-logs')(logStream);

app.get('/', function (req, res) {
  console.log('Request to /', logStream, apiUrl);

  superagent
    .post(`${apiUrl}/post`)
    .send({ apiUrl, logStream })
    .set('Accept', 'application/json')
    .end((err, response) => {
      if (err || !response.ok) {
        console.log(`Error occured while making a call to ${apiUrl}/post`);
      } else {
        console.log(`Post result to ${apiUrl}/post:`, JSON.stringify(response.body));
      }
    });

  res.send(`
    <h1>Hello Wrld!</h1>
    <h2>API_URL: ${apiUrl}</h2>
    <h2>LOG_STREAM: ${logStream}</h2>
  `);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
