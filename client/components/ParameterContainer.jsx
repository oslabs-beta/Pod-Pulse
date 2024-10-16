import React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Parameter from './Parameter';

const ParameterContainer = ({ memory, setMemory, memTimeFrame, setMemTimeFrame, cpu, setCpu, cpuTimeFrame, setCpuTimeFrame }) => {
  return(
    <Box id='paramBox'>
      <Parameter
        metric='Memory'
        value={memory}
        onChange={setMemory}
        timeFrame={memTimeFrame}
        onTimeChange={setMemTimeFrame}
        />
      <Parameter
        metric='CPU'
        value={cpu}
        onChange={setCpu}
        timeFrame={cpuTimeFrame}
        onTimeChange={setCpuTimeFrame}
        />
    </Box>
  )
}

export default ParameterContainer;