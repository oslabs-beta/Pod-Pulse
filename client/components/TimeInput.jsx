import * as React from 'react';
import Box from '@mui/material/Box';

const TimeInput = ({ timeFrame, onTimeChange }) => {
  return (
    <Box>
      <input
        id='timeInput'
        type='number'
        label='minutes'
        placeholder='Refresh window (min)'
        min='1'
        max='1000'
        value={timeFrame}
        onChange={(e) => onTimeChange(e.target.value)}>
      </input>
    </Box>
  );
};

export default TimeInput;