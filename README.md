# PodPulse

PodPulse is a tool for developers utilizing and maintaining kubernetes clusters.\
With PodPulse, you may set a specific configuration of desired pod metrics\
you wish to monitor and enable an automatic restart of designated pods based\
on your specific needs.\

## Getting Started

In order to use PodPulse, you need to deploy Prometheus on your cluster to\
monitor pod metrics. You may also wish to install Grafana, but it isn't\
necessary for PodPulse to function.

Additionally, it is _strongly_ recommended you utilize Helm for installing\
the following tools. You can find instructions to install helm here:\
https://v3-1-0.helm.sh/docs/intro/install/

See below for the recommended steps to setup a Prometheus deployment.

If using Minikube, perform the following steps to get your Kubernetes cluster\
running with Prometheus. Continue to step 3 if you would like to view\
visualizations with Grafana..

1. Start your cluster and install Prometheus-operator. To do this, run the\
   following commands in your home directory:
   1. `minikube start`
   2. ```
      helm repo add prometheus-community\
      https://prometheus-community.github.io/helm-charts
      helm repo add stable https://charts.helm.sh/stable
      helm repo update
      ```
   3. `helm install prometheus prometheus-community/kube-prometheus-stack`

2) Once Prometheus pods and services are running on your cluster, you can\
   run Prometheus on https://localhost:9090/ with the following command:\
   `kubectl port-forward prometheus-prometheus-kube-prometheus-prometheus-0 9090`\
   Should you also wish to run Grafana in your browser, this is done using:\
   `kubectl port-forward deployments/prometheus-grafana 3000` and then\
   navigating to https://localhost:3000/
   1. If using Grafana, you will need to login to access visualizations.\
      The default username is `admin` and the default password is `prom-operator`.
3) After navigating to https://localhost:9090/ you may enter commands in the\
   Prometheus dashboard if you would like to test its funcitonality. The search\
   bar requires the use of PromQL to gather various metrics. You can read more\
   here: https://prometheus.io/docs/prometheus/latest/querying/examples/
4) Install dependencies with: `npm install`
5) Run the server using: `npm run back:start`
6) Run the client using: `npm run dev`
