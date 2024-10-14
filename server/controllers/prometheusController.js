const promBundle = require('express-prom-bundle');
const fetch = require('node-fetch');

const prometheusUrl = 'http://localhost:9090/api/v1/query?query=';
const deletePod = require('./miniKubeConnect');

console.log('Prometheus Controller Running!');

const cpuMinutes = 30;

// how often server will query PromQL for server performance metrics
// const callInterval = 0.15;

// const memoryMinutes = 30;

const queryController = {};

const deletedPods = [];

const cpuUsage = {
  label: 'CPU',
  queryString: `sum(rate(container_cpu_usage_seconds_total[${cpuMinutes}m])) by (pod, namespace)`,
  threshold: 0.02,
};

const memoryUsage = {
  label: 'Memory',
  queryString: `sum(container_memory_working_set_bytes) by (pod, namespace)`,
  threshold: 100,
};

const queryPrometheus = async (queryObj) => {
  // console.log('In queryPrometheus');
  const { label, queryString, threshold } = queryObj;
  const encodedUrl = `${prometheusUrl}${encodeURIComponent(queryString)}`;
  const response = await fetch(encodedUrl);
  const data = await response.json();
  // console.log(data.statuspod);
  if (data.status === 'success') {
    const results = await data.data.result;
    console.log('PromQL data:', results);
    results.forEach((pod) => {
      console.log('Data', pod.value[1]);
      if (pod.value[1] > threshold) {
        console.log(
          `${pod.metric.pod} pod ${label} usage of ${
            Math.floor(pod.value[1] * 10000) / 100
          }% exceeds threshold of ${threshold * 100}%. Deleting ${
            pod.metric.pod
          }`
        );
        deletedPods.push({
          timestamp: new Date(),
          namespace: pod.metric.namespace,
          podName: pod.metric.pod,
          label: label,
          value: pod.value[1],
          threshold: threshold,
        });
        console.log(deletedPods);
        deletePod(pod.metric.pod, pod.metric.namespace);
      } else {
        // console.log(
        //   `${pod.metric.pod} ${label} usage of ${
        //     Math.floor(pod.value[1] * 10000) / 100
        //   }% falls below threshold of ${Math.floor(threshold * 10000) / 100}%.`
        // );
      }
    });
  } else {
    console.error(`PromQL ${label} query failed:`, data.error);
  }
};

// queryController.sendCPUQuery = async () => {
//   try {
//     // console.log('In sendCPUQuery');
//     const cpuUrl = `${prometheusUrl}${encodeURIComponent(cpuQuery)}`;
//     const response = await fetch(cpuUrl);
//     const cpuData = await response.json();
//     // console.log(cpuData.status);
//     if (cpuData.status === 'success') {
//       const results = await cpuData.data.result;
//       console.log('PromQL CPU data:', results);
//       results.forEach((el) => {
//         console.log('CPU Data', el.value[1]);
//         if (el.value[1] > cpuThreshold) {
//           console.log(
//             `${el.metric.pod} CPU usage of ${
//               Math.floor(el.value[1] * 10000) / 100
//             }% exceeds threshold of ${cpuThreshold * 100}%. Deleting ${
//               el.metric.pod
//             }`
//           );
//           { namespace: el.metric.namespace; podName: el.metric.pod; value: el.value[1]; threshold: cpuThreshold}
//           // add pod to deletedPods obj
//           deletePod(el.metric.pod, el.metric.namespace);
//         } else {
//           console.log(
//             `${el.metric.pod} CPU usage of ${
//               Math.floor(el.value[1] * 10000) / 100
//             }% falls below threshold of ${
//               Math.floor(cpuThreshold * 10000) / 100
//             }%.`
//           );
//         }
//       });
//     } else {
//       console.error('PromQL CPU query failed:', cpuData.error);
//     }
//   } catch (err) {
//     console.error('Error sending PromQL CPU query:', err);
//     return next(err);
//   }
// };

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
  queryPrometheus(cpuUsage);
  // queryPrometheus(memoryQuery);
}, 1000 * 60 * callInterval);

module.exports = deletedPods;
