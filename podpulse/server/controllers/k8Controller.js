const { exec } = require('child_process');

const k8Controller = {};

//// Preliminary attempt at controller to delete pod. Save location for pod name that must be
//// restarted (currently noted as res.locals.pod) has not been set.
// k8Controller.deletePod = (req, res, next) => {
//   try {
//     exec(`kubectl delete pod ${res.locals.podName}`)
//   } catch (err) {
//     const errObj = {
//       log: `k8Controller.deletePod, error message: ${err}`,
//       message: {
//         err: `Pod met restart criteria but could not be deleted.`
//       }
//     }
//   }
// }
