import React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import TimeInput from './TimeInput';

const Parameter = ({ metric, onChange, value, timeFrame, onTimeChange }) => {
  return (
    <Box className='sliderBox' sx={{ width: '300px' }}>
      <span id='sliderTitle'> 
        <h3>{`${metric} Usage (%)`}</h3>
      </span>
      <Slider
        sx={{ color: '#54abb4', width: '150px' }}
        defaultValue={50}
        aria-label='Small'
        valueLabelDisplay='auto'
        value={value}
        className='slider'
        id='myRange'
        onChange={(e) => onChange(e.target.value)}
      />
      <TimeInput
        id='inputBox'
        onTimeChange={onTimeChange}
        timeFrame={timeFrame}
      />
    </Box>
  );
};

export default Parameter;
