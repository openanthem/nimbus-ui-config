/**
 * @license
 * Copyright 2016-2018 the original author or authors.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * \@author Sandeep.Mantha
 * \@whatItDoes 
 * 
 * \@howToUse 
 * 
 */
'use strict';

var express    = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
var app = express();
require('dotenv').config();

var https_enabled = process.env.SECURE || false;
var https_cert_filename;
var https_cert_passphrase;
var https_options;

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/styles', express.static(__dirname + '/assets/css'));
app.use('/', express.static(__dirname + '/assets/javascript'));
app.use('**/images', express.static(__dirname + '/assets/images'));

app.use(function(req, res, next) {
  var allowedOrigins = ['https://va33dlvnim300.wellpoint.com:9443', 'https://va33dlvnim300.wellpoint.com:8443', 'http://localhost:8082', 'http://localhost:7443'];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1){
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'POST, GET','OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,jsnlog-requestid');
  next();
});

const port = process.env.PORT || 4201;

require('./app/routes')(app, {});

if(https_enabled) {
  https_cert_filename = process.env.CERTFILENAME;
  https_cert_passphrase = process.env.CERTPASSPHRASE;
  https_options = {
    pfx: fs.readFileSync(https_cert_filename),
    passphrase: https_cert_passphrase
  };
  https.createServer(https_options, app).listen(port, () => {
    console.log('Secure Log server is running on port: ' + port);
  });
} else {
  app.listen(port, () => {
    console.log('content server is running on port: ' + port);
  });
}