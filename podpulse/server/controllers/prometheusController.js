const promBundle = require('express-prom-bundle');

const prometheusUrl = 'http://localhost:9090';

const promQueryURL = `${prometheusUrl}/api/v1/query?query=sum (rate (container_cpu_usage_seconds_total{image!=“”}[30m])) by (pod_name)`

const promController = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  promClient: {
    collectDefaultMetrics: {},
  },
});
