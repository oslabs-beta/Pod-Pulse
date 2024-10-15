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
    const barColors = cpuUsages.map((value) => {
      if (value >= 100) return 'rgba(255,0,0,0.2)';
      else if (value >= 75) return 'rgba(255, 255, 0, 0.2)';
      else return 'rgba(75, 192, 192, 0.2)';
    });
    const borderColors = cpuUsages.map((value) => {
      if (value >= 100) return 'rgba(255,0,0,1.0)';
      else if (value >= 75) return 'rgba(255,255, 0, 1.0)';
      else return 'rgba(75, 192, 192, 1.0)';
    });


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
            backgroundColor: barColors,
            borderColor: borderColors,
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
            min: 0, // Set minimum value
            max: 100, // Set maximum value
            ticks: {
              stepSize: 10, // Set interval for ticks
              callback: function (value) {
                return value + '%'; // Display the tick values with % sign
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                // Round the value to remove decimal places
                const roundedValue = Math.round(context.raw);
                return `${context.dataset.label}: ${roundedValue}%`;
              },
            },
          },
        },
      },
    });

    setGraphDisplay(newGraphDisplay);
    if (graphMinutes < 60) {
      setGraphTitleDisplay(
        `Displaying Average ${title} data for the last ${graphMinutes} minutes!`
      );
    } else if (graphMinutes === 60) {
      setGraphTitleDisplay(
        `Displaying Average ${title} data for the last ${graphMinutes / 60} hour!`
      );
    } else {
      setGraphTitleDisplay(
        `Displaying Average ${title} data for the last ${graphMinutes / 60} hours!`
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
            selectDisplay(60);
          }}
        >
          1 Hour
        </button>
        <button
          className='timeDisplay'
          onClick={(e) => {
            e.preventDefault();
            selectDisplay(10);
          }}
        >
          10 Minutes
        </button>
      </form>
    </div>
  );
};

export default Graph;
