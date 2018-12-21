#Log Server
This project can be used to post logs from any client side application

## Development Set Up
Create a .env file with the below content.
PORT=8000
FILEPATH='log'
LEVEL='debug'

Run npm install

Run npm start

The log server would be running on 8000 port with a log level of 'debug'. The .env file can be configured as per the needs of the application.

The following options can be set to enable the logging level in the corresponding client
TRACE	1000
DEBUG	2000
INFO	3000
WARN	4000
ERROR	5000
FATAL	6000