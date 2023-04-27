const express = require('express');
const app = express();
const cors = require('cors');
const userRequests = require('../backend/requests/userRequests');
const videoRequests = require('../backend/requests/videoReqeusts');
const connect = require('../backend/dbConnect');
const port = 4000;
const bodyParser = require('body-parser');


app.use(bodyParser.json());

app.options('*', cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});
//Connect to DB
connect();
//Handle user related requests
userRequests(app);
videoRequests(app);
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});