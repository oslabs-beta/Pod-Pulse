import React, { useEffect, useState, useRef } from 'react';
import Graph from './Graph2'
import { Chart, registerables } from 'chart.js';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

const GraphsContainer = ({ graphMinutes, setGraphMinutes, cpuData, memoryData }) => {
  return(
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
  );
};

export default GraphsContainer;