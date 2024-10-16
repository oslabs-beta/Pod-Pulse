import React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import TimeInput from './TimeInput';
import { Unstable_NumberInput as BaseNumberInput } from '@mui/base/Unstable_NumberInput';

const Parameter = ({ metric, onChange, value, timeFrame, onTimeChange }) => {
  return (
    <Box className='sliderBox' sx={{ width: '300px' }}>
      <Typography variant='h6'>{`${metric} Usage`}</Typography>
      <Slider
        sx={{ color: '#adadad', width: '150px' }}
        defaultValue={50}
        aria-label='Small'
        valueLabelDisplay='auto'
        value={value}
        className='slider'
        id='myRange'
        onChange={(e) => onChange(e.target.value)}
      />
      <TimeInput id='inputBox'/>
    </Box>
  );
};

export default Parameter;
