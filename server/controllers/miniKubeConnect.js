const k8s = require('@kubernetes/client-node');

//points to the config file for your cluster that contains the endpoint URL and authorization
const kubeConfigFile = new k8s.KubeConfig();
kubeConfigFile.loadFromDefault();

const k8sApi = kubeConfigFile.makeApiClient(k8s.CoreV1Api);

//// miniKubeController not currently in use as not used with any requests.
// const miniKubeController = {}; // Controller object to eventually hold methods

// miniKubeController.getPods = async (req, res, next) => {
//   try {
//     const response = await k8sApi.listPodForAllNamespaces();
//     response.body.items.forEach((pod) => {
//       console.log(`${pod.metadata.namespace} - ${pod.metadata.name}`);
//     });
//   } catch (err) {
//     console.log(`Error getting pods: ${err}`);
//   }
// };

// miniKubeController.deletePod = async (req, res, next) => {
//   const { podName, podNamespace } = req.body;
//   try {
//     const res = await k8sApi.deleteNamespacedPod(podName, podNamespace);
//     console.log(`${podName} was deleted`, res.body);
//     return next();
//   } catch (err) {
//     console.log(`Error deleting pod: ${JSON.stringify(err)}`);
//   }
// };

async function getPods() {
  try {
    const res = await k8sApi.listPodForAllNamespaces();
    res.body.items.forEach((pod) => {
      console.log(`${pod.metadata.namespace} - ${pod.metadata.name}`);
    });
  } catch (err) {
    console.log(`Error getting pods: ${err}`);
  }
}

async function deletePod(podName, podNamespace) {
  try {
    const res = await k8sApi.deleteNamespacedPod(podName, podNamespace);
    // console.log(`${podName} was deleted`, res.body);
  } catch (err) {
    console.log(`Error deleting pod: ${JSON.stringify(err)}`);
  }
}

module.exports = deletePod;
