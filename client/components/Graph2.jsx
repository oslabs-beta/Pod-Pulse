import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

//registering all default components that may be used to create the graph but once we know exactly what we will use we can specify them directly to make it more optimized
Chart.register(...registerables);

const Graph = ({ title, graphMinutes, setGraphMinutes, data }) => {
  const [graphDisplay, setGraphDisplay] = useState(null);
  const [graphTitleDisplay, setGraphTitleDisplay] = useState(
    'No Graph to display!'
  );

  //creates a mutable object to attach our graph to
  const chartRef = useRef(null);

  const selectDisplay = (mins) => {
    console.log(`selectDisplay func setting display to ${mins} hours!`);
    if (graphMinutes !== mins) {
      setGraphMinutes(mins);
    }
  };

  useEffect(() => {
    if (!data) {
      setGraphTitleDisplay('No Data Available');
      return;
    }

    const labels = data.map((item) => item.metric.pod);
    const cpuUsages = data.map((item) => parseFloat(item.value[1]));

    // we are destroying the previous chart instance if it exists
    if (graphDisplay) {
      graphDisplay.destroy();
    }

    const newGraphDisplay = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: title,
            data: cpuUsages,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            ticks: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    setGraphDisplay(newGraphDisplay);
    if (graphMinutes <= 60) {
      setGraphTitleDisplay(
        `Displaying ${title} data for the last ${graphMinutes / 60} hour!`
      );
    } else {
      setGraphTitleDisplay(
        `Displaying ${title} data for the last ${graphMinutes / 60} hours!`
      );
    }
  }, [graphMinutes, data, title]);

  return (
    <div>
      <h2>{title}</h2>
      <div>{graphTitleDisplay}</div>
      <canvas ref={chartRef} width='800' height='400'></canvas>
      <form>
        <button
          className='timeDisplay'
          onClick={(e) => {
            e.preventDefault();
            selectDisplay(1440);
          }}
        >
          24 Hours
        </button>
        <button
          className='timeDisplay'
          onClick={(e) => {
            e.preventDefault();
            selectDisplay(480);
          }}
        >
          8 Hours
        </button>
        <button
          className='timeDisplay'
          onClick={(e) => {
            e.preventDefault();
            selectDisplay(60);
          }}
        >
          1 Hour
        </button>
      </form>
    </div>
  );
};

export default Graph;
