import React from 'react';

const SavedConfig = ({ savedConfiguration }) => {
    const {savedMemoryThreshold, savedMemTimeFrame, savedCpuThreshold, savedCpuTimeFrame} = savedConfiguration


    console.log('making saved config table: ', savedConfiguration)
  return (
    <div>
      Current saved configuration:
      <div>Max memory usage: {savedMemoryThreshold}</div>
      <div>Time frame: {savedMemTimeFrame}</div>
      <div>Max cpu usage: {savedCpuThreshold}</div>
      <div>Time frame: {savedCpuTimeFrame}</div>
    </div>
  );
};

export default SavedConfig