// const promBundle = require('express-prom-bundle');
const prometheusQueries = require('../services/prometheusService');

//eliminated global variables in case multiple requests come in rapidly
let config = {
  cpu: {
    label: 'cpu',
    threshold: 80,
    minutes: 30,
    queryString: `
  avg(rate(container_cpu_usage_seconds_total[30m])) by (pod, namespace)/
  sum(kube_pod_container_resource_requests{resource="cpu"}) by (pod, namespace) * 100
  `,
  },
  memory: {
    label: 'memory',
    threshold: 80,
    minutes: 30,
    queryString: `sum(avg_over_time(container_memory_usage_bytes[30m])) by (pod, namespace)
    /
    sum(kube_pod_container_resource_requests{resource="memory"}) by (pod, namespace) * 100
    `,
  },
};

//create the controller object
const configController = {};
// define a function saveConfig as a method on the controller
configController.saveConfig = (req, res, next) => {
  try {
    // deconstruct the values sent in from the client off of the req.body
    const { memory, memTimeFrame, cpu, cpuTimeFrame } = req.body;

    config.cpu.threshold = cpu;
    config.cpu.minutes = cpuTimeFrame;
    config.cpu.queryString = `
  avg(rate(container_cpu_usage_seconds_total[${cpuTimeFrame}m])) by (pod, namespace)/
  sum(kube_pod_container_resource_requests{resource="cpu"}) by (pod, namespace) * 100
  `;
    config.memory.threshold = memory;
    config.memory.minutes = memTimeFrame;
    config.memory.queryString = `sum(avg_over_time(container_memory_usage_bytes[${memTimeFrame}m])) by (pod, namespace)
    /
    sum(kube_pod_container_resource_requests{resource="memory"}) by (pod, namespace) * 100
    `;

    res.locals.savedConfig = {
      cpu: { threshold: config.cpu.threshold, minutes: config.cpu.minutes },
      memory: {
        threshold: config.memory.threshold,
        minutes: config.memory.minutes,
      },
    };

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

module.exports = { config, configController };
