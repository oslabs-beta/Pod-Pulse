// work on the logic that will loop through the data that we get back from prometheus (from the time interval set for CPU and MEMORY) and compare it to the CPU usage set by client 
// we will be receiving back an object from the (jsonified string) from the prometheusController
// maybe we are able to perform this shutdown in the Query itself?
//iterate through this object and determine the pods that are over the cpu limit 
// once these pods are identified then we route to miniKubeController and we delete the specific pods 


// collecting from client a threshold for cpu usage and percentage and timeframe average 
// CPU, MEMORY, TIME INTERVAL
// time frame 5 mins: cpu usage every 5 mins or memory every 5 mins 
// client submits the time intervals they want and the cpu usage - we will receive that data - we will use the time interval to query the promQL database - we will shutdown the pods that are over the cpu usage limit 