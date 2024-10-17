import React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Parameters from './Parameter';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';

const ParameterContainer = ({
  handleSubmit,
  memory,
  setMemory,
  memTimeFrame,
  setMemTimeFrame,
  cpu,
  setCpu,
  cpuTimeFrame,
  setCpuTimeFrame,
}) => {
  return (
    <>
      <Box id='paramBox'>
        <Parameters
          metric='Memory'
          value={memory}
          onChange={setMemory}
          timeFrame={memTimeFrame}
          onTimeChange={setMemTimeFrame}
        />
        <Parameters
          metric='CPU'
          value={cpu}
          onChange={setCpu}
          timeFrame={cpuTimeFrame}
          onTimeChange={setCpuTimeFrame}
        />
      </Box>
      <Box id='configButton'>
        <Button
          sx={{
            color: '#242424',
            backgroundColor: '#adadad',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#b0b0b0 !important',
            },
          }}
          variant='contained'
          endIcon={<DataSaverOnIcon />}
          id='saveButton'
          onClick={handleSubmit}
        >
          Save Config
        </Button>
      </Box>
    </>
  );
};

export default ParameterContainer;
