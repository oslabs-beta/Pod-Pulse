import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

//registering all default components that may be used to create the graph but once we know exactly what we will use we can specify them directly to make it more optimized
Chart.register(...registerables);

const Graph = ({ title, graphMinutes, setGraphMinutes, data }) => {
  const [graphDisplay, setGraphDisplay] = useState(null);
  const [graphTitleDisplay, setGraphTitleDisplay] = useState('');

  //creates a mutable object to attach our graph to
  const chartRef = useRef(null);

  const handleSelectDisplay = (mins) => {
    console.log(`selectDisplay func setting display to ${mins} minutes!`);
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
    // rgba(216,190,31,255)
    const sortedData = combinedData.sort((a, b) => a.pod.localeCompare(b.pod));

    const labels = sortedData.map((item) => item.pod);
    const cpuUsages = sortedData.map((item) => item.usage);
    const barColors = cpuUsages.map((value) => {
      if (value >= 100) return 'rgba(222, 55, 27, 0.4)';
      else if (value >= 75) return 'rgba(216,190,31,0.4)';
      else return 'rgba(84,171,180,0.4)';
    });
    const borderColors = cpuUsages.map((value) => {
      if (value >= 100) return 'rgba(222, 55, 27, 1.0)';
      else if (value >= 75) return 'rgba(216,190,31,1.0)';
      else return 'rgba(84,171,180,1.0)';
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
            min: 0,
            max: 100,
            ticks: {
              stepSize: 10,
              callback: function (value) {
                return value + '%';
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
  }, [graphMinutes, data, title]);

  return (
    <div>
      <Typography variant='h5'>{`Average ${title}`}</Typography>
      <div className='sliderContainer'>
        <div className='tabs'>
          <input
            className='radio'
            type='radio'
            id={`radio-1-${title}`}
            name={`tabs-${title}`}
            checked={graphMinutes === 1440}
            onChange={() => handleSelectDisplay(1440)}
          />
          <label htmlFor={`radio-1-${title}`} className='tab'>
            24 Hours
          </label>

          <input
            className='radio'
            type='radio'
            id={`radio-2-${title}`}
            name={`tabs-${title}`}
            checked={graphMinutes === 60}
            onChange={() => handleSelectDisplay(60)}
          />
          <label htmlFor={`radio-2-${title}`} className='tab'>
            1 Hour
          </label>

          <input
            className='radio'
            type='radio'
            id={`radio-3-${title}`}
            name={`tabs-${title}`}
            checked={graphMinutes === 10}
            onChange={() => handleSelectDisplay(10)}
          />
          <label htmlFor={`radio-3-${title}`} className='tab'>
            10 Minutes
          </label>

          <span
            className='graphSlider'
            style={{
              transform: `translateX(${
                graphMinutes === 1440 ? 0 : graphMinutes === 60 ? 100 : 200
              }%)`,
            }}
          ></span>
        </div>
      </div>
      <Typography variant='subtitle1'>{graphTitleDisplay}</Typography>
      <canvas ref={chartRef} width='400' height='400'></canvas>
    </div>
  );
};

export default Graph;
