import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

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

    const combinedData = data.map((item, index) => ({
      pod: item.metric.pod,
      usage: parseFloat(item.value[1]),
    }));

    const sortedData = combinedData.sort((a,b) => a.pod.localeCompare(b.pod));



    const labels = sortedData.map((item) => item.pod);
    const cpuUsages = sortedData.map((item) => item.usage);
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
      <Typography variant='h4'>{title}</Typography>
      <Typography variant='subtitle'>{graphTitleDisplay}</Typography>
      <canvas ref={chartRef} width='400' height='400'></canvas>
      <form id='buttonForm'>
        <Button
          sx={{color: '#242424', backgroundColor: '#adadad'}}
          variant='contained'
          className='timeDisplay'
          onClick={(e) => {
            e.preventDefault();
            selectDisplay(1440);
          }}
        >
          24 Hours
        </Button>
        <Button
          sx={{color: '#242424', backgroundColor: '#adadad'}}
          variant='contained'
          className='timeDisplay'
          onClick={(e) => {
            e.preventDefault();
            selectDisplay(60);
          }}
        >
          8 Hours
        </Button>
        <Button
          sx={{color: '#242424', backgroundColor: '#adadad'}}
          variant='contained'
          className='timeDisplay'
          onClick={(e) => {
            e.preventDefault();
            selectDisplay(10);
          }}
        >
          1 Hour
        </Button>
      </form>
    </div>
  );
};

export default Graph;
