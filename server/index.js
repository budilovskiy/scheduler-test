const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const router = express.Router();
const restPort = 3001;

// middleware route that all requests pass through
router.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  response.setHeader('Access-Control-Allow-Headers', '*');
  response.setHeader('Access-Control-Allow-Credentials', true);

  // push through to the proper route
  next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// url: http://localhost:3001/
app.get('/', (request, response) => response.send('REST server'));

// all routes prefixed with /api
app.use('/api', router);

// using router.get() to prefix our path
// url: http://localhost:3001/api/
router.get('/', (request, response) => {
  response.send('API');
});

router.get('/data', (request, response) => {
  fs.readFile('./data.json', (err, data) => {
    response.json(JSON.parse(data));
  });
});

router.post('/data', (request, response) => {
  fs.writeFile('./data.json', JSON.stringify(request.body, null, 2), err => {
    if (err) throw err;
  });
  response.json({ requestBody: response.body });
});

// set the REST server to listen on port 3001
app.listen(restPort, () => console.log(`Listening on port ${restPort} for REST`));

const clientApp = express();
const clientPort = 9001;

clientApp.use(bodyParser.urlencoded({ extended: false }));
clientApp.use(bodyParser.json());
clientApp.use(express.static('../react-redux-scheduler/dist'));

/* Server Initialization */
clientApp.get('/', (req, res) =>
  res.sendFile('react-redux-scheduler/dist/index.html', { root: '../' })
);
clientApp.listen(clientPort, () =>
  console.log(`Serving client app on port ${clientPort}`)
);
