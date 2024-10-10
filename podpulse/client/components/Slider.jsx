import React from 'react';

const Slider = ({ metric, onChange, value, timeFrame, onTimeChange }) => {
  return (
    <div className='sliderBox'>
      <h3>{`${metric} Usage`}</h3>
      <input
        type='range'
        min='1'
        max='100'
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
    </div>
  );
};

export default Slider;
