const express = require('express');
const path = require('path');
const app = express();
const PORT = 3333;
const fs = require('fs');
const queryController = require('./controllers/prometheusController');

const deletedPods = require('./controllers/prometheusController.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../client/assets')));

app.get('/', (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

app.get('/deleted', (req, res) => {
  res.status(200).json(deletedPods);
});
// Route to handle the configuration from the frontend
// app.post('/config', async (req, res) => {
//   try {
//     // deconstruct the configuration data from the request body
//     const { memory, memTimeFrame, cpu, cpuTimeFrame } = req.body;

//     console.log('Received client configuration:', {
//       memory,
//       memTimeFrame,
//       cpu,
//       cpuTimeFrame,
//     });


//     // ??Send the results back to the frontend - this needs to be adjusted based on how the data is manipulated after the query??
//     res.status(200).json({ cpuResults, memoryResults });
//   } catch (error) {
//     console.error('Error processing configuration:', error);
//     res.status(500).json({ error: 'Failed to process configuration' });
//   }
// });

app.use('*', (req, res) => {
  res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'App caught unknown middleware error.',
    status: 500,
    message: {
      err: 'An error occurred, please try again.',
    },
  };
  const errObj = Object.assign({}, defaultErr, err);
  console.log(errObj.log);
  res.status(errObj.status).json(errObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
