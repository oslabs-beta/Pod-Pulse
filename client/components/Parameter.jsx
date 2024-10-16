import React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

const Parameter = ({ metric, onChange, value, timeFrame, onTimeChange }) => {
  return (
    <Box className='sliderBox' sx={{ width: '300px' }}>
      <h3>{`Set Maximum ${metric} Usage`}</h3>
      <h3>Current Max {metric}:<br /> {value} </h3>
      <Slider
        sx={{ color: '#c9c7e1', width: '150px' }}
        defaultValue={50}
        aria-label='Small'
        valueLabelDisplay='auto'
        value={value}
        className='slider'
        id='myRange'
        onChange={(e) => onChange(e.target.value)}
      />
      <h3>{`Time Frame (in min)`}</h3>
      <input
        type='number'
        min='1'
        max='1000'
        value={timeFrame}
        id='timeFrame'
        onChange={(e) => onTimeChange(e.target.value)}
      />
    </Box>
  );
};

export default Parameter;