// LEAVE IN ROOT FOR VITE

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import './style.css';
import Slider from './client/components/Slider';
import Graph from './client/components/Graph';

const App = () => {
  const [memory, setMemory] = useState(0);
  const [memTimeFrame, setMemTimeFrame] = useState(1);
  const [cpu, setCpu] = useState(0);
  const [cpuTimeFrame, setCpuTimeFrame] = useState(1);

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

  //function that shifts display based on selected hours
  const [graphHours, setGraphHours] = useState();

  // const graphHoursHandler = (hours) => {
  //   console.log(`Handler setting graph to ${hours} hours`);
  //   setGraphHours(hours);
  // };

  // console.log('Checking for consoles!');
  return (
    <div>
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
      <button id='saveButton' onClick={handleSubmit}>
        Save Config
      </button>
      <div className='graphs'>
        <Graph
          title='Memory Usage'
          graphHours={graphHours}
          // graphHoursHandler={graphHoursHandler}
          setGraphHours={setGraphHours}
        />

        <Graph
          title='CPU Usage'
          graphHours={graphHours}
          // graphHoursHandler={graphHoursHandler}
          setGraphHours={setGraphHours}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />);
