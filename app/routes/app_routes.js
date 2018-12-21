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

const tsFormat = () => (new Date()).toLocaleTimeString();

// //const env = process.env.NODE_ENV || 'development';
const logDir = process.env.FILEPATH;
var winston = require('winston');
var fs = require('fs');
const url = require('url');  
const querystring = require('querystring');
require('winston-daily-rotate-file');
var level = 3000;

// if (!fs.existsSync(logDir)) {
//     fs.mkdirSync(logDir);
// }

// const logger = winston.createLogger({
//     timestamp: tsFormat,
//     transports: [
//         new (winston.transports.DailyRotateFile)({
//             filename: `${logDir}/application-%DATE%.log`,
//             datePattern: 'YYYY-MM-DD-HH',
//             zippedArchive: true,
//             level: process.env.LEVEL,
//             json: true,
//             colorize: 'all',
//             maxSize: '5m'
//           })
//     ]
// });

module.exports = function(app) {
   
    app.post('/log', (req, res) => {
       if(req.body.lg!=null && req.body.lg.length > 0) {
            log_n(logger,req.body)
       }
       res.send('');
    });

    var log_n = function (logger, logJson) {
        var nbrLogEntries = logJson.lg.length;
        var i = 0;
    
        for (i = 0; i < nbrLogEntries; i++) {
            var receivedLogEntry = logJson.lg[i];
            var loggerName = receivedLogEntry.n;
            var logLevel = receivedLogEntry.l;
            // Build object to log through the server side jsnlog.
            var newLogEngry = {
                timestamp: new Date(receivedLogEntry.t),
                sessionID: logJson.r,
                browserVendor: logJson.v,
                appVersion: logJson.a,
                message: deserialize(receivedLogEntry.m)
            };
            if(logLevel == 3000)
                logger.info(newLogEngry);
            else if(logLevel == 6000 || logLevel == 5000)
                logger.error(newLogEngry);
            else if(logLevel == 4000)
                logger.warn(newLogEngry);
            else if(logLevel == 2000)
                logger.debug(newLogEngry);
        }
    }

    var deserialize = function (s) {
        try {
            return JSON.parse(s);
        } catch (e) {
            return s;
        }
    };

     /* Rest method to return the log options at runtime for the client application logging*/
    app.get('/log/options', (req, res) => {
        var options = {
            "bufferSize": 20,
            "storeInBufferLevel": 1000,
            "level": level,
            "sendWithBufferLevel": 6000,
            "logToConsole": false
        }
       res.send(options);
    });
    
    /* Rest method to change the log level at runtime for the client application logging*/
    app.get('/log/changeloglevel', (req, res) => {
       let inputLevel = req.query.level;
       level = inputLevel;
       res.send('');
    });
};