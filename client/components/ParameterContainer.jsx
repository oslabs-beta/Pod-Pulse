import React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Parameter from './Parameter';


const ParameterContainer = ({ handleSubmit, memory, setMemory, memTimeFrame, setMemTimeFrame, cpu, setCpu, cpuTimeFrame, setCpuTimeFrame }) => {
  return(
    <>
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
        onTimeChange={setCpuTimeFrame} />
    </Box>
    <Box id='configButton'>
      <Button
        sx={{color: '#242424', backgroundColor: '#adadad', borderRadius: '4px'}}
        variant='contained' 
        id='saveButton' 
        onClick={handleSubmit}>
        Save Config
      </Button>
    </Box>
    </>
  )
}

export default ParameterContainer;