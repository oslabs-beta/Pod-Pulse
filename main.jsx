// LEAVE IN ROOT FOR VITE

import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Navbar from './client/components/Navbar';
import './style.css';
import ParameterContainer from './client/components/ParameterContainer';
import GraphsContainer from './client/components/GraphsContainer';
import RestartedPodTable from './client/components/RestartedPodTable';
import fullLogo from './client/assets/fullLogo.png';
import logoDesign from './client/assets/logoDesign.png';
import logoName from './client/assets/logoName.png';
import logoSlogan from './client/assets/logoSlogan.png';

const App = () => {
  //State to configure frontend parameters
  const [memory, setMemory] = useState(80);
  const [memTimeFrame, setMemTimeFrame] = useState(30);
  const [cpu, setCpu] = useState(80);
  const [cpuTimeFrame, setCpuTimeFrame] = useState(30);
  //savedConfiguration added to track saved parameters for frontend display. ADD TO FRONTEND DISPLAY
  const [savedConfiguration, setSavedConfiguration] = useState({
    savedMemoryThreshold: 0,
    savedMemTimeFrame: 0,
    savedCpuThreshold: 0,
    savedCpuTimeFrame: 0,
  });

  //State for graph displays
  const [memoryData, setMemoryData] = useState([]);
  const [cpuData, setCpuData] = useState([]);
  const [cpuGraphMinutes, setCpuGraphMinutes] = useState(60);
  const [memoryGraphMinutes, setMemoryGraphMinutes] = useState(60);
  const [restartedPods, setRestartedPods] = useState([]);

  const queryCpuData = async (minutes) => {
    try {
      const response = await fetch(
        `http://localhost:3333/graphData?cpuGraphMinutes=${minutes}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch graph data');
      }
      const result = await response.json();
      setCpuData(result.cpuData.data.result);

      console.log('Graph data fetched successfully:', result);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  const queryMemoryData = async (minutes) => {
    try {
      const response = await fetch(
        `http://localhost:3333/graphData?memoryGraphMinutes=${minutes}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch graph data');
      }
      const result = await response.json();
      setMemoryData(result.memData.data.result);

      console.log('Graph data fetched successfully:', result);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  // //fetch memory data to be displayed in graph
  // const fetchMemoryData = async () => {
  //   const query = `sum(avg_over_time(container_memory_usage_bytes[${graphMinutes}m])) by (pod)
  //   /
  //   sum(kube_pod_container_resource_requests{resource="memory"}) by (pod) * 100
  //   `;
  //   const res = await fetch(
  //     `http://localhost:9090/api/v1/query?query=${encodeURIComponent(query)}`
  //   );
  //   const data = await res.json();
  //   setMemoryData(data.data.result);
  // };

  // //fetch cpu data to be displayed in graph
  // const fetchCpuData = async () => {
  //   const query = `
  //   avg(rate(container_cpu_usage_seconds_total[${graphMinutes}m])) by (pod)/
  //   sum(kube_pod_container_resource_requests{resource="cpu"}) by (pod) * 100
  //   `;
  //   const res = await fetch(
  //     `http://localhost:9090/api/v1/query?query=${encodeURIComponent(query)}`
  //   );
  //   const data = await res.json();
  //   setCpuData(data.data.result);
  // };

  const fetchRestartedPods = async () => {
    const res = await fetch('http://localhost:3333/restarted');
    console.log(res);
    const restartedPods = await res.json();
    console.log(restartedPods);
    setRestartedPods(restartedPods);
  };

  const cpuGraphMinutesRef = useRef(cpuGraphMinutes);
  const memoryGraphMinutesRef = useRef(memoryGraphMinutes);

  useEffect(() => {
    // Update refs whenever state changes
    cpuGraphMinutesRef.current = cpuGraphMinutes;
    memoryGraphMinutesRef.current = memoryGraphMinutes;
  }, [cpuGraphMinutes, memoryGraphMinutes]);

  useEffect(() => {
    // Fetch both data on initial mount
    queryCpuData(cpuGraphMinutes);
    queryMemoryData(memoryGraphMinutes);

    // Set interval for refreshing data every 60 seconds
    const intervalId = setInterval(() => {
      queryCpuData(cpuGraphMinutesRef.current);
      queryMemoryData(memoryGraphMinutesRef.current);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    queryMemoryData(memoryGraphMinutes);
  }, [memoryGraphMinutes]);

  useEffect(() => {
    queryCpuData(cpuGraphMinutes);
  }, [cpuGraphMinutes]);

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
      setSavedConfiguration({
        savedMemoryThreshold: result.memory.threshold,
        savedMemTimeFrame: result.memory.minutes,
        savedCpuThreshold: result.cpu.threshold,
        savedCpuTimeFrame: result.cpu.minutes,
      });
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
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <img
          src={fullLogo}
          alt='Logo'
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
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
        savedConfiguration={savedConfiguration}
      />
      <GraphsContainer
        id='graphContain'
        cpuGraphMinutes={cpuGraphMinutes}
        memoryGraphMinutes={memoryGraphMinutes}
        setCpuGraphMinutes={setCpuGraphMinutes}
        setMemoryGraphMinutes={setMemoryGraphMinutes}
        cpuData={cpuData}
        memoryData={memoryData}
        queryCpuData={queryCpuData}
        queryMemoryData={queryMemoryData}
      />
      {restartedPods.length > 0 ? (
        <RestartedPodTable restartedPods={restartedPods} />
      ) : null}
    </div>
  );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />);
