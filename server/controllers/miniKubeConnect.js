const k8s = require('@kubernetes/client-node');

//points to the config file for your cluster that contains the endpoint URL and authorization
const kubeConfigFile = new k8s.KubeConfig();
kubeConfigFile.loadFromDefault();

const k8sApi = kubeConfigFile.makeApiClient(k8s.CoreV1Api);

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
// async function that deletes the specific pod using the two passed in arguments
async function deletePod(podName, podNamespace) {
  console.log('Attempting to delete', podName)
  // console.log('Namespace is', podNamespace)
  try {
    // promise that uses the method on the kubernetes api to delete a specific pod in the DB
    const res = await k8sApi.deleteNamespacedPod(podName, podNamespace);
    console.log(`Successfully deleted ${podName} with Namespace ${podNamespace}.`);
  } catch (err) {
    // console.log('error deleting pod')
    console.log(`Error deleting pod: ${JSON.stringify(err)}`);
  }
}

module.exports = deletePod;
