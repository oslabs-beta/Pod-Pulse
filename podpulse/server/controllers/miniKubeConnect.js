import k8s from '@kubernetes/client-node';

//points to the config file for your cluster that contains the endpoint URL and authorization 
const kubeConfigFile = new k8s.KubeConfig();
kubeConfigFile.loadFromDefault();

const k8sApi = kubeConfigFile.makeApiClient(k8s.CoreV1Api);

const k8Controller = {}; // Controller object to eventually hold methods

k8Controller.getPods = async (req, res, next) => {
  try {
      const response = await k8sApi.listPodForAllNamespaces();
      response.body.items.forEach((pod) => {
          console.log(`${pod.metadata.namespace} - ${pod.metadata.name}`)
      })
  } catch (err){
      console.log(`Error getting pods: ${err}`)
  }
};

k8Controller.deletePod = async (req, res, next) => {
  try {
      const res = await k8sApi.deleteNamespacedPod(res.locals.podName, res.locals.podNamespace);
          console.log(`${podName} was deleted`, res.body);
      }
  catch (err) {
      console.log(`Error deleting pod: ${JSON.stringify(err)}`);
  }
}



async function getPods() {
  try {
      const res = await k8sApi.listPodForAllNamespaces();
      res.body.items.forEach((pod) => {
          console.log(`${pod.metadata.namespace} - ${pod.metadata.name}`)
      })
  } catch (err){
      console.log(`Error getting pods: ${err}`)
  }
};

async function deletePod(podName, podNamespace){
  try {
      const res = await k8sApi.deleteNamespacedPod(podName, podNamespace);
          console.log(`${podName} was deleted`, res.body);
      }
  catch (err) {
      console.log(`Error deleting pod: ${JSON.stringify(err)}`);
  }
}

deletePod('prometheus-grafana-57c485fc8c-zzx7d', 'default');