const promBundle = require('express-prom-bundle');
const fetch = require('node-fetch');

const prometheusUrl = 'http://localhost:9090/api/v1/query?query=';
const deletePod = require('./miniKubeConnect');

console.log('Prometheus Controller Running!');

let cpuMinutes = 30;

// how often server will query PromQL for server performance metrics
const callInterval = 5;

let memoryMinutes = 30;

const queryController = {};

const deletedPods = [];

const cpuUsage = {
  label: 'CPU',
  queryString: `
    avg(rate(container_cpu_usage_seconds_total[${cpuMinutes}m])) by (pod)/
    sum(kube_pod_container_resource_requests{resource="cpu"}) by (pod) * 100
    `,
  threshold: 60,
};

const memoryUsage = {
  label: 'Memory',
  queryString: `sum(avg_over_time(container_memory_usage_bytes[${memoryMinutes}m])) by (pod)
    /
    sum(kube_pod_container_resource_requests{resource="memory"}) by (pod) * 100
    `,
  threshold: 60,
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
            Math.floor(pod.value[1] * 100) / 100
          }% exceeds threshold of ${threshold}%. Deleting ${pod.metric.pod}`
        );
        deletedPods.push({
          timestamp: new Date(),
          namespace: pod.metric.namespace,
          podName: pod.metric.pod,
          label,
          value: pod.value[1],
          threshold,
        });
        console.log(deletedPods);
        deletePod(pod.metric.pod, pod.metric.namespace);
        // } else {
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

const configController = {};

configController.saveConfig = (req, res, next) => {
  try {
    const { memory, memTimeFrame, cpu, cpuTimeFrame } = req.body;
    cpuUsage.threshold = cpu;
    memoryUsage.threshold = memory;
    cpuMinutes = cpuTimeFrame;
    memoryMinutes = memTimeFrame;
    res.locals.savedConfig = {
      cpuThreshold: cpuUsage.threshold,
      memoryThreshold: memoryUsage.threshold,
      cpuMinutes,
      memoryMinutes,
    };
    console.log(res.locals.savedConfig);
    prometheusQueries();
    return next();
  } catch (err) {
    return next(err);
  }
};

const prometheusQueries = () => {
  queryPrometheus(cpuUsage);
  queryPrometheus(memoryUsage);
};

setInterval(prometheusQueries, 1000 * 60 * callInterval);

module.exports = { deletedPods, configController };
