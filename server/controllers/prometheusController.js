// const promBundle = require('express-prom-bundle');
// const fetch = require('node-fetch');
// import config object from configController
const config = require('./configController');
// import queryPromethus helper function from prometheusService
const queryPrometheus = require('../services/prometheusService');
// we are importing the deletePod function from the miniKube Controller
const deletePod = require('./miniKubeController');
// server side check to see if the backend is up and running
console.log('Prometheus Controller Running!');

// how often server will query PromQL for server performance metrics
const callInterval = 0.3;
// our array that will hold the object models for the deleted pods and will eventually be displayed to our client on the front end

const restartedPods = [];

const prometheusController = {};

prometheusController.fetchGraphData = async (req, res, next) => {
  try {
    const cpuGraphMinutes = req.query.cpuGraphMinutes;
    const memoryGraphMinutes = req.query.memoryGraphMinutes;

    let cpuData, memData;

    if (cpuGraphMinutes) {
      const cpuQuery = `
      avg(rate(container_cpu_usage_seconds_total[${cpuGraphMinutes}m])) by (pod, namespace)/
      sum(kube_pod_container_resource_requests{resource="cpu"}) by (pod, namespace) * 100
      `;
      cpuData = await queryPrometheus(cpuQuery);
      res.locals.data = { cpuData };
    }
    if (memoryGraphMinutes) {
      const memQuery = `sum(avg_over_time(container_memory_usage_bytes[${memoryGraphMinutes}m])) by (pod, namespace)
    /
    sum(kube_pod_container_resource_requests{resource="memory"}) by (pod, namespace) * 100
    `;
      memData = await queryPrometheus(memQuery);
      res.locals.data = { memData };
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

//function used to check if pods need to be restarted. calls helper function to query prometheus
const checkRestart = async (obj) => {
  // console.log('In queryPrometheus');
  console.log(obj);
  const { threshold, queryString, label } = obj;
  console.log(`LOOK HERE: ${queryString}`);
  // define constant data as evaluated result of queryPrometheus function with argument encodedUrl
  const data = await queryPrometheus(queryString);
  // we can now access a key on the returned object that is stored in data and if the status is strictly equal to the string 'success'
  if (data.status === 'success') {
    // returning an array with objects(pods) within the javascript data object
    const results = data.data.result;
    console.log(`PromQL ${label} data array:`, results);
    // iterate through the result array and access the values within each object (which is a pod)
    results.forEach((pod) => {
      // console.log(`Pod ${label} data:`, pod.metric.pod, pod.value[1]);
      // if the memory/cpu usage is currently greater than the threshold and confirming that the pod name isn't the pod that monitors the other pods in the cluster
      if (
        pod.value[1] > threshold &&
        pod.metric.pod !== 'prometheus-prometheus-kube-prometheus-prometheus-0'
      ) {
        console.log(
          `${pod.metric.pod} pod ${label} usage of ${
            Math.floor(pod.value[1] * 100) / 100
          }% exceeds threshold of ${threshold}%. Deleting ${pod.metric.pod}`
        );
        //push the current pod that is being restarted to the array
        restartedPods.push({
          timestamp: new Date(),
          namespace: pod.metric.namespace,
          podName: pod.metric.pod,
          label,
          value: pod.value[1],
          threshold,
        });
        console.log(restartedPods);
        //invoke the deletePod function and pass in the arguments for the specific pod that needs to be deleted
        deletePod(pod.metric.pod, pod.metric.namespace);
      }
    });
  } else {
    console.error(`PromQL ${label} query failed:`, data.error);
  }
};
// console.log(`line 186: ${JSON.stringify(config)}`);
//function that invokes the queryPrometheus function, passing in cpuUsage, memoryUsage respectively

const restartChecks = async (configObj) => {
  await checkRestart(configObj.cpu);
  await checkRestart(configObj.memory);
};
//setInterval function to run the entire code above and query the Prometheus DB every 'x' minutes
setInterval(() => restartChecks(config.config), 1000 * 60 * callInterval);
// export the restartedPods Array and the configController
module.exports = { restartedPods, prometheusController };
