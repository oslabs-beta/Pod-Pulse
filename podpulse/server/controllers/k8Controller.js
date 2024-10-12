//// Currently deprecated

// const { exec } = require('child_process');
// const k8s = require('@kubernetes/client-node');
// const kc = new k8s.KubeConfig();
// kc.loadFromDefault();
// const k8sApi = kc.makeApiClient(k8s.CoreV1Api);


// k8sApi.deleteNamespacedPod = async (req, res, next) => {
//   try {
//     const 
//   } catch (err) {
//     const errObj = {
//       log: `k8Controller.deleteNamespacedPod, error message: ${err}`,
//       message: {
//         err: 'Pod met restart criteria but could not be deleted.',
//       },
//     };
//     return next(errObj);
//   }

// }

// /**
//  * const namespace = {
//     metadata: {
//         name: 'test',
//     },
// };

// const main = async () => {
//     try {
//         const createNamespaceRes = await k8sApi.createNamespace(namespace);
//         console.log('New namespace created: ', createNamespaceRes.body);

//         const readNamespaceRes = await k8sApi.readNamespace(namespace.metadata.name);
//         console.log('Namespace: ', readNamespaceRes.body);

//         await k8sApi.deleteNamespace(namespace.metadata.name, {});
//     } catch (err) {
//         console.error(err);
//     }
// };

// deleteNamespacedPod



//  */

// //// Preliminary attempt at controller to delete pod. Save location for pod name that must be
// //// restarted (currently noted as res.locals.pod) has not been set.
// // k8Controller.deletePod = (req, res, next) => {
// //   try {
// //     exec(`kubectl delete pod ${res.locals.podName}`)
// //   } catch (err) {
// //     const errObj = {
// //       log: `k8Controller.deletePod, error message: ${err}`,
// //       message: {
// //         err: `Pod met restart criteria but could not be deleted.`
// //       }
// //     }
// //   }
// // }
