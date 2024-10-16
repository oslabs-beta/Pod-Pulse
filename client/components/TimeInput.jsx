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

const TimeInput = React.forwardRef(function CustomNumberInput(props, ref) {
  return (
    <input
      id='timeInput'
      type='number'
      label='minutes'
      placeholder='Refresh window (min)'>
    </input>
  );
});


export default TimeInput;