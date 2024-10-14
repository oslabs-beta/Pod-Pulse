const promBundle = require('express-prom-bundle');
const fetch = require('node-fetch');

const prometheusUrl = 'http://localhost:9090/api/v1/query?query=';
const deletePod = require('./miniKubeConnect');

console.log('Prometheus Controller Running!');

const cpuMinutes = 30;

// how often server will query PromQL for server performance metrics
const callInterval = 0.15;

// const memoryMinutes = 30;

const cpuThreshold = 0.02; //FIX THIS LATER

// const memoryThreshold = ;  //FIX THIS LATER

const cpuQuery = `sum(rate(container_cpu_usage_seconds_total[${cpuMinutes}m])) by (pod, namespace)`;

const memoryQuery = `sum(container_memory_working_set_bytes) by (pod, namespace)`;

const queryController = {};

//Can we combine sendCUPQuery
queryController.sendCPUQuery = async () => {
  try {
    console.log('In sendCPUQuery');
    const cpuUrl = `${prometheusUrl}${encodeURIComponent(cpuQuery)}`;
    const response = await fetch(cpuUrl);
    const cpuData = await response.json();
    console.log(cpuData.status);

    if (cpuData.status === 'success') {
      const results = await cpuData.data.result;
      console.log('PromQL CPU data:', results);
      results.forEach((el) => {
        console.log('CPU Data', el.value[1]);
        if (el.value[1] > cpuThreshold) {
          console.log(
            `${el.metric.pod} CPU usage of ${
              Math.floor(el.value[1] * 10000) / 100
            }% exceeds threshold of ${cpuThreshold * 100}%. Deleting ${
              el.metric.pod
            }`
          );
          deletePod(el.metric.pod, el.metric.namespace);
        } else {
          console.log(
            `${el.metric.pod} CPU usage of ${
              Math.floor(el.value[1] * 10000) / 100
            }% falls below threshold of ${
              Math.floor(cpuThreshold * 10000) / 100
            }%.`
          );
        }
      });
    } else {
      console.error('PromQL CPU query failed:', cpuData.error);
    }
  } catch (err) {
    console.error('Error sending PromQL CPU query:', err);
    return next(err);
  }
};

// queryController.sendMemoryQuery = async () => {
//   try {
//     console.log('In sendMemoryQuery');
//     const cpuUrl = `${prometheusUrl}${encodeURIComponent(memoryQuery)}`;
//     const response = await fetch(cpuUrl);
//     const memoryData = await response.json();
//     if (memoryData.status === 'success') {
//       console.log('PromQL memory data:', memoryData.data.result);
//     } else {
//       console.error('PromQL memory query failed:', memoryData.error);
//     }
//   } catch (err) {
//     console.error('Error sending PromQL memory query:', err);
//     return next(err);
//   }
// };

setInterval(() => {
  queryController.sendCPUQuery();
  // queryController.sendMemoryQuery();
}, 1000 * 60 * callInterval);

module.exports = { queryController, callInterval };
