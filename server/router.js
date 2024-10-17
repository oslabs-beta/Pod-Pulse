// import express library to build a web server, used to handle https requests from client
const express = require('express');
// import path module for handling and transforming paths to be accessed cross platform
const path = require('path');
// this is our webserver invocation stored in this app variable
const app = express();
// this is the port that the backend server will be run on - listening for incoming requests
const PORT = 3333;
// allow reading and writing file systems
const fs = require('fs');
// importing cors package "Cross-Origin Resource Sharing" - allows server to handle requests from different localhosts (origins)
const cors = require('cors');
// destructure deletePods and configController from the prometheusController so that we can use it in this file
const {
  restartedPods,
  configController,
  prometheusController,
} = require('./controllers/prometheusController.js');
// middleware that parses incoming requests into json format - makes it easy to work with the req body
app.use(express.json());
// middleware that parses url-encoded data and has us have rich objects and arrays
app.use(express.urlencoded({ extended: true }));
// serve static files from the given file - absolute path & moving into the directory that the file is running
app.use(express.static(path.resolve(__dirname, '../client/assets')));
// enables cors for all routes - allows our API to respond to all requests
app.use(cors());
// handle this get request at the root and serve the static html file below along with a success status of 200
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});
// fetch request to serve array of pods that have been restarted
app.get('/restarted', (req, res) => {
  res.status(200).json(restartedPods);
});
app.get('/graphData', prometheusController.fetchGraphData, (req, res) => {
  console.log(res.locals.data);
  res.status(200).json(res.locals.data);
});
// post request from the config endpoint that will trigger the saveconfig middleware and send back the saved config object to the client with their settings
app.post('/config', configController.saveConfig, (req, res) => {
  res.status(201).json(res.locals.savedConfig);
});
// catch all error handler that is invoked when a user tries to accesss a route that doesn't exist
app.use('*', (req, res) => {
  res.status(404).send('Page not found');
});
//global error handling middleware that is trigger when a middleware or route has an error
app.use((err, req, res, next) => {
  // the template object for the error messaging
  const defaultErr = {
    log: 'App caught unknown middleware error.',
    status: 500,
    message: {
      err: 'An error occurred, please try again.',
    },
  };
  // merge the 3 objects into one, overwriting the template with a specific error coming from a specific middleware
  const errObj = Object.assign({}, defaultErr, err);
  console.log(errObj.log);
  //response with the appropriate status and error message to the client
  res.status(errObj.status).json(errObj.message);
});
// start the server and have it intake requests on the assigned port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
