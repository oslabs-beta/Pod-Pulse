const promBundle = require('express-prom-bundle');
const fetch = require('node-fetch');

// this is the url to be able to submit user queries to prometheus
const prometheusUrl = 'http://localhost:9090/api/v1/query?query=';

// variable that can be changed to tell function in queryPrometheus query whether we're demo'ing
const runDemo = true;
// name of pod to be restarted if running demo
const demoPod = 'kube-apiserver-minikube';

// helper function to handle prometheus queries
const queryPrometheus = async (queryStr) => {
  try {
    // the Url we will be querying Prometheus with
    const encodedUrl = `${prometheusUrl}${encodeURIComponent(queryStr)}`;
    // promise that has a fetch request to Prometheus and the data is stored in the response variable as a string
    const response = await fetch(encodedUrl);
    //promise that jsonifies the reponse from Prometheus and stores the data in an javascript object format
    const data = await response.json();
    if (runDemo === true) {
      if (demoPod.length === 0)
        console.log('ERROR: server set to demo but no demo pod name entered');
      for (const pod of data.data.result) {
        if (pod.metric.pod === demoPod) {
          pod.value[1] = 95 + Math.random() * 5;
        } else {
          pod.value[1] = Math.random() * 15;
        }
      }
    }
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports = queryPrometheus;