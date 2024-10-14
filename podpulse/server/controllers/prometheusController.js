const promBundle = require('express-prom-bundle');
const fetch = require('node-fetch');

const prometheusUrl = 'http://localhost:9090/api/v1/query?query=';

const cpuMinutes = 30;

// how often server will query PromQL for server performance metrics
const callInterval = 5;

// const memoryMinutes = 30;

const cpuQuery = `
  (sum(rate(container_cpu_usage_seconds_total[${cpuMinutes}m])) by (pod, namespace) /
   sum(kube_pod_container_resource_requests_cpu_cores{resource="requests"}) by (pod, namespace)) * 100
`;

const memoryQuery = `sum(container_memory_working_set_bytes) by (pod, namespace)`;

const sendCPUQuery = async () => {
  try {
    const cpuUrl = `${prometheusUrl}${encodeURIComponent(cpuQuery)}`;
    const response = await fetch(cpuUrl);
    const cpuData = await response.json();

    if (cpuData.status === 'success') {
      console.log('PromQL CPU data:', cpuData.data.result);
    } else {
      console.error('PromQL CPU query failed:', cpuData.error);
    }
  } catch (err) {
    console.error('Error sending PromQL CPU query:', err);
    return next(err);
  }
};

const sendMemoryQuery = async () => {
  try {
    const cpuUrl = `${prometheusUrl}${encodeURIComponent(memoryQuery)}`;
    const response = await fetch(cpuUrl);
    const memoryData = await response.json();
    if (memoryData.status === 'success') {
      console.log('PromQL memory data:', memoryData.data.result);
    } else {
      console.error('PromQL memory query failed:', memoryData.error);
    }
  } catch (err) {
    console.error('Error sending PromQL memory query:', err);
    return next(err);
  }
};

setInterval(() => {
  sendCPUQuery();
  sendMemoryQuery();
}, 1000 * 60 * callInterval);

const promController = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  promClient: {
    collectDefaultMetrics: {},
  },
});

module.exports = promController;
