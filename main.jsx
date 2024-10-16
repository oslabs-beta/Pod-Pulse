// LEAVE IN ROOT FOR VITE

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Navbar from './client/components/Navbar';
import './style.css';
import ParameterContainer from './client/components/ParameterContainer';
import GraphsContainer from './client/components/GraphsContainer';
import DeletedPodTable from '/client/components/DeletedPodTable';

const App = () => {
  const [memory, setMemory] = useState(80);
  const [memTimeFrame, setMemTimeFrame] = useState(30);
  const [cpu, setCpu] = useState(80);
  const [cpuTimeFrame, setCpuTimeFrame] = useState(30);

  const [memoryData, setMemoryData] = useState([]);
  const [cpuData, setCpuData] = useState([]);

  const [graphMinutes, setGraphMinutes] = useState(60);
  const [deletedPods, setDeletedPods] = useState([]);

  //fetch memory data to be displayed in graph
  const fetchMemoryData = async () => {
    const query = `sum(avg_over_time(container_memory_usage_bytes[${graphMinutes}m])) by (pod)
    /
    sum(kube_pod_container_resource_requests{resource="memory"}) by (pod) * 100
    `;
    const res = await fetch(
      `http://localhost:9090/api/v1/query?query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setMemoryData(data.data.result);
  };

  //fetch cpu data to be displayed in graph
  const fetchCpuData = async () => {
    const query = `
    avg(rate(container_cpu_usage_seconds_total[${graphMinutes}m])) by (pod)/
    sum(kube_pod_container_resource_requests{resource="cpu"}) by (pod) * 100
    `;
    const res = await fetch(
      `http://localhost:9090/api/v1/query?query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setCpuData(data.data.result);
    setCpuData(data.data.result);
  };

  const fetchDeletedPods = async () => {
    const res = await fetch('http://localhost:3333/deleted');
    console.log(res);
    const deletedPods = await res.json();
    console.log(deletedPods);
    setDeletedPods(deletedPods);
  };

  useEffect(() => {
    // fetch deleted pods every 10 seconds
    // const intervalId =
    setInterval(fetchDeletedPods, 10000);
    // console.log(intervalId);
    // console.log(deletedPods);
    // return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchMemoryData(graphMinutes);
    fetchCpuData(graphMinutes);
  }, [graphMinutes]);

  // SAMPLE CLIENT DATA:
  // {
  //   "memory": 1024,
  //   "memTimeFrame": 30,
  //   "cpu": 4,
  //   "cpuTimeFrame": 15
  // }

  //function for submitting our new config
  const setConfiguration = async (memory, memTimeFrame, cpu, cpuTimeFrame) => {
    try {
      //deconstructing to get values
      const config = {
        memory,
        memTimeFrame,
        cpu,
        cpuTimeFrame,
      };
      // promise waiting on the fetch requst to the endpoint
      const response = await fetch('http://localhost:3333/config', {
        //post request from client side sends data to the server
        method: 'POST',
        // indicating that we are sending JSON data from client
        headers: {
          'Content-Type': 'application/json',
        },
        // convert the javascript object into a string
        body: JSON.stringify(config),
      });
      // if there is something wrong with the response
      if (!response.ok) {
        throw new Error('Failed to send configuration');
      }
      // parse the json reponse - What will we be responding with??
      const result = await response.json();
      console.log('Configuration saved successfully:', result);
      // error handler
    } catch (error) {
      console.error('Error sending configuration:', error);
    }
  };

  //function that runs when we click the submit button
  const handleSubmit = () => {
    console.log(`Memory: ${memory}, TimeFrame: ${memTimeFrame}`);
    console.log(`CPU: ${cpu}, TimeFrame: ${cpuTimeFrame}`);
    console.log({ memory, memTimeFrame, cpu, cpuTimeFrame });
    //invoke the set configuration function passing in the client submitted fields
    setConfiguration(memory, memTimeFrame, cpu, cpuTimeFrame);
  };

  return (
    <div>
      <Navbar />
      <ParameterContainer
        handleSubmit={handleSubmit}
        memory={memory}
        setMemory={setMemory}
        memTimeFrame={memTimeFrame}
        cpu={cpu}
        setCpu={setCpu}
        cpuTimeFrame={cpuTimeFrame}
        setCpuTimeFrame={setCpuTimeFrame}
        setMemTimeFrame={setMemTimeFrame}
      />
      <GraphsContainer
        graphMinutes={graphMinutes}
        setGraphMinutes={setGraphMinutes}
        cpuData={cpuData}
        memoryData={memoryData}
      />
      {deletedPods.length > 0 ? (
        <DeletedPodTable deletedPods={deletedPods} />
      ) : null}
    </div>
  );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />);
