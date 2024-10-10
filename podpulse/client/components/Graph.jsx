import React, { useEffect, useState } from 'react';

const Graph = ({ title, graphHours, setGraphHours }) => {
  const [graphDisplay, setGraphDisplay] = useState('No Graph to display!');
  function selectDisplay(hours) {
    console.log(`selectDisplay func setting display to ${hours} hours!`);
    if (graphHours !== hours) setGraphHours(hours);
  }

  // let graphDisplay = 'No Graph to display!';

  useEffect(() => {
    console.log(`Entering switch, hours currently set to ${graphHours} hours`);
    switch (graphHours) {
      case 1:
        if (title === 'CPU Usage') setGraphDisplay('CPU1-Graph Needed!');
        else if (title === 'Memory Usage')
          setGraphDisplay('MEM1-Graph Needed!');
        console.log(`Switch says ${graphDisplay}`);
        break;
      case 8:
        if (title === 'CPU Usage') setGraphDisplay('CPU8-Graph Needed!');
        else if (title === 'Memory Usage')
          setGraphDisplay('MEM8-Graph Needed!');
        console.log(`Switch says ${graphDisplay}`);
        break;
      case 24:
        if (title === 'CPU Usage') setGraphDisplay('CPU24-Graph Needed!');
        else if (title === 'Memory Usage')
          setGraphDisplay('MEM24-Graph Needed!');
        console.log(`Switch says ${graphDisplay}`);
        break;
      default:
        console.log('Switch broke');
    }
  }, [graphHours]);

  console.log(graphDisplay);
  return (
    <div>
      {title}
      <div>{graphDisplay}</div>
      <form>
        <button
          className='timeDisplay'
          onClick={(e) => {
            e.preventDefault();
            selectDisplay(24);
          }}
        >
          24 Hours
        </button>
        <button
          className='timeDisplay'
          onClick={(e) => {
            e.preventDefault();
            selectDisplay(8);
          }}
        >
          8 Hours
        </button>
        <button
          className='timeDisplay'
          onClick={(e) => {
            e.preventDefault();
            selectDisplay(1);
          }}
        >
          Past Hour
        </button>
      </form>
    </div>
  );
};

export default Graph;
