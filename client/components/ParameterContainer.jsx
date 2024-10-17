import React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Parameters from './Parameter';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';

const ParameterContainer = ({ handleSubmit, memory, setMemory, memTimeFrame, setMemTimeFrame, cpu, setCpu, cpuTimeFrame, setCpuTimeFrame }) => {
  return(
    <div id='configContainer'>
    <Box id='paramBox'>
      <Parameters
        metric='Memory'
        value={memory}
        onChange={setMemory}
        timeFrame={memTimeFrame}
        onTimeChange={setMemTimeFrame} />
      <Parameters
        metric='CPU'
        value={cpu}
        onChange={setCpu}
        timeFrame={cpuTimeFrame}
        onTimeChange={setCpuTimeFrame} />
    </Box>
    <div id='configButton'>
    <Box>
      <Button
        sx={{color: '#242424', backgroundColor: '#adadad', borderRadius: '4px'}}
        variant='contained'
        id='saveButton'
        onClick={handleSubmit}>
        Save Config
      </Button>
    </Box>
    </div>
    </div>
  )
}

export default ParameterContainer;