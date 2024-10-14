// LEAVE IN ROOT FOR VITE

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import ParameterContainer from './client/components/ParameterContainer';
import Graph from './client/components/Graph2';

const App = () => {
  const [memory, setMemory] = useState(0);
  const [memTimeFrame, setMemTimeFrame] = useState(1);
  const [cpu, setCpu] = useState(0);
  const [cpuTimeFrame, setCpuTimeFrame] = useState(1);

  const [memoryData, setMemoryData] = useState([]);
  const [cpuData, setCpuData] = useState([]);

  const [graphMinutes, setGraphMinutes] = useState(60);

  const fetchMemoryData = async () => {
    const query = `
    sum(container_memory_usage_bytes) by (pod) /
    sum(kube_pod_container_resource_requests_memory_bytes) by (pod) * 100
  `;
    const res = await fetch(
      `http://localhost:9090/api/v1/query?query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setMemoryData(data.data.result);
  };

  const fetchCpuData = async () => {
    const query = `
    sum(rate(container_cpu_usage_seconds_total[${graphMinutes}m])) by (pod) /
    sum(kube_pod_container_resource_requests_cpu_cores) by (pod) * 100
  `;
    const res = await fetch(
      `http://localhost:9090/api/v1/query?query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setCpuData(data.data.result);
  };

  useEffect(() => {
    fetchMemoryData(graphMinutes);
    fetchCpuData(graphMinutes);
  }, [graphMinutes]);

  //function for submitting our new config
  const setConfiguration = async () => {
    //this is where we send data to ???
  };

  //function that runs when we click the submit button
  const handleSubmit = () => {
    console.log(`Memory: ${memory}`);
    console.log(`Memory TimeFrame: ${memTimeFrame}`);
    console.log(`CPU: ${cpu}`);
    console.log(`CPU TimeFrame: ${cpuTimeFrame}`);
    // setConfiguration();
  };

  return (
    <div>
<<<<<<< HEAD:podpulse/main.jsx
      <div className='memoryContainer'>
        <Slider
          metric='Memory'
          value={memory}
          onChange={setMemory}
          timeFrame={memTimeFrame}
          onTimeChange={setMemTimeFrame}
        />
      </div>
      <div className='cpuContainer'>
        <Slider
          metric='CPU'
          value={cpu}
          onChange={setCpu}
          timeFrame={cpuTimeFrame}
          onTimeChange={setCpuTimeFrame}
        />
      </div>
=======
      <ParameterContainer 
        memory={memory}
        setMemory={setMemory}
        memTimeFrame={memTimeFrame}
        cpu={cpu}
        setCpu={setCpu}
        cpuTimeFrame={cpuTimeFrame} 
        setCpuTimeFrame={setCpuTimeFrame}
      />
>>>>>>> dev:main.jsx
      <button id='saveButton' onClick={handleSubmit}>
        Save Config
      </button>
      <div className='graphs'>
        <Graph
          title='Memory Usage'
          graphMinutes={graphMinutes}
          setGraphMinutes={setGraphMinutes}
          data={memoryData}
        />

        <Graph
          title='CPU Usage'
          graphMinutes={graphMinutes}
          setGraphMinutes={setGraphMinutes}
          data={cpuData}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />);
