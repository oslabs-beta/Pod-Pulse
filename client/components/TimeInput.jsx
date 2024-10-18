import * as React from 'react';
import { Unstable_NumberInput as BaseNumberInput } from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

// const TimeInput = ({ onChange, onTimeChange }) => {
//   return (
//     <Box>
//       <BaseNumberInput
//         type='number'
//         min='1'
//         max='1000'
//         value={timeFrame}
//         id='timeFrame'
//         onChange={(e) => onTimeChange(e.target.value)}>
//       </BaseNumberInput>
//     </Box>
//   );
// };

const TimeInput = React.forwardRef(function CustomNumberInput(
  { timeFrame, onTimeChange, ...props },
  ref
) {
  return (
    <div id='timeInput'>
      <h3 id='timeInputLabel'>Refresh window (min):</h3>
        <input
          id='timeInput'
          type='number'
          min='1'
          max='10000'
          value={timeFrame}
          onChange={(e) => onTimeChange(e.target.value)}
          placeholder='Refresh window (min)'
          aria-label='Refresh window in minutes' />
      </div>
  );
});

export default TimeInput;
