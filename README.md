# PodPulse
PodPulse is a tool for developers utilizing and maintaining kubernetes clusters.\
With PodPulse, you may set a specific configuration of desired pod metrics\
you wish to monitor and enable an automatic restart of designated pods based\
on your specific needs.\

## Getting Started
In order to use PodPulse, you need to deploy Prometheus on your cluster to\
monitor pod metrics. You may also wish to install Grafana, but it isn't\
necessary for PodPulse to function.

Additionally, it is *strongly* recommended you utilize Helm for installing\
the following tools. You can find instructions to install helm here:\
https://v3-1-0.helm.sh/docs/intro/install/

See below for the recommended steps to setup a Prometheus deployment.

1) Follow the below GitLab repository starting at 'install Prometheus-operator':\
https://gitlab.com/nanuchi/youtube-tutorial-series/-/blob/master/prometheus-exporter/install-prometheus-commands.md
2) Once Prometheus pods and services are running on your cluster, you can\
run Prometheus on https://localhost:9090/ with the following command:\
`kubectl port-forward prometheus-prometheus-kube-prometheus-prometheus-0 9090`\
Should you also wish to run Grafana in your browser, this is done using:\
`kubectl port-forward deployments/prometheus-grafana 3000` and then\
navigating to https://localhost:3000/
3) After navigating to https://localhost:9090/ you may enter commands in the\
Prometheus dashboard if you would like to test its funcitonality. The search\
bar requires the use of PromQL to gather various metrics. You can read more\
here: https://prometheus.io/docs/prometheus/latest/querying/examples/