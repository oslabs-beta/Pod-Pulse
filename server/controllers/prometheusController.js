const promBundle = require('express-prom-bundle');
const fetch = require('node-fetch');
// this is the url to be able to submit user queries to prometheus
const prometheusUrl = 'http://localhost:9090/api/v1/query?query=';
// we are importing the deletePod function from the miniKube Controller
const deletePod = require('./miniKubeConnect');
// server side check to see if the backend is up and running
console.log('Prometheus Controller Running!');

//eliminated global variables in case multiple requests come in rapidly
let config = {
  cpu: {
    threshold: 80,
    minutes: 30,
  },
  memory: {
    threshold: 80,
    minutes: 30,
  },
};

// how often server will query PromQL for server performance metrics
const callInterval = 0.3;
// our array that will hold the object models for the deleted pods and will eventually be displayed to our client on the front end

const restartedPods = [];

// variable that can be changed to tell function in queryPrometheus query whether we're demo'ing
const runDemo = true;
// name of pod to be restarted if running demo
const demoPod = 'kube-apiserver-minikube';

//create the controller object
const configController = {};
// define a function saveConfig as a method on the controller
configController.saveConfig = (req, res, next) => {
  try {
    // deconstruct the values sent in from the client off of the req.body
    const { memory, memTimeFrame, cpu, cpuTimeFrame } = req.body;

    config.cpu.threshold = cpu;
    config.cpu.minutes = cpuTimeFrame;
    config.memory.threshold = memory;
    config.memory.minutes = memTimeFrame;

    res.locals.savedConfig = { ...config };

    console.log(res.locals.savedConfig);
    // invoke the prometheusQueries
    prometheusQueries();
    //move to the next piece of middleware/response to client
    return next();
    // error catcher
  } catch (err) {
    //invokes the next function in the chain, passing in err
    return next(err);
  }
};

const prometheusController = {};

prometheusController.fetchGraphData = (req, res, next) => {
  try {
    const graphMinutes = req.query.graphMinutes;
  } catch (err) {
    return next(err);
  }
};

//function used to query and get data from Prometheus using the user inputs from the frontend - asynchronous function w/ the user inputs Object Model as a parameter
const queryPrometheus = async (label) => {
  // console.log('In queryPrometheus');

  const queryString =
    label === 'cpu'
      ? `
  avg(rate(container_cpu_usage_seconds_total[${config.cpu.minutes}m])) by (pod, namespace)/
  sum(kube_pod_container_resource_requests{resource="cpu"}) by (pod, namespace) * 100
  `
      : `sum(avg_over_time(container_memory_usage_bytes[${config.memory.minutes}m])) by (pod, namespace)
    /
    sum(kube_pod_container_resource_requests{resource="memory"}) by (pod, namespace) * 100
    `;

  // console.log(`LOOK HERE: ${memoryMinutes}`);
  // the Url we will be querying Prometheus with
  const encodedUrl = `${prometheusUrl}${encodeURIComponent(queryString)}`;
  // promise that has a fetch request to Prometheus and the data is stored in the response variable as a string
  const response = await fetch(encodedUrl);
  //promise that jsonifies the reponse from Prometheus and stores the data in an javascript object format
  const data = await response.json();
  // we can now access a key on the returned object that is stored in data and if the status is strictly equal to the string 'success'
  if (data.status === 'success') {
    // returning an array with objects(pods) within the javascript data object
    const results = data.data.result;
    //// If demo'ing product, set runDemo variable to true and set demoPod to be the name of the pod you want to restart. Otherwise, set runDemo to false and this block of code will be skipped.
    if (runDemo === true) {
      if (demoPod.length === 0)
        console.log('ERROR: server set to demo but no demo pod name entered');
      for (const pod of results) {
        if (pod.metric.pod === demoPod) {
          pod.value[1] = 95 + Math.random() * 5;
        } else {
          pod.value[1] = Math.random() * 15;
        }
      }
    }
    console.log(`PromQL ${label} data array:`, results);
    const threshold = config[label].threshold;
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
//function that invokes the queryPrometheus function, passing in cpuUsage, memoryUsage respectively
const prometheusQueries = async () => {
  await queryPrometheus('cpu');
  await queryPrometheus('memory');
};
//setInterval function to run the entire code above and query the Prometheus DB every 'x' minutes
setInterval(prometheusQueries, 1000 * 60 * callInterval);
// export the restartedPods Array and the configController
module.exports = { restartedPods, configController, prometheusController };
