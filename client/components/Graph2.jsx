import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

//registering all default components that may be used to create the graph but once we know exactly what we will use we can specify them directly to make it more optimized
Chart.register(...registerables);

const Graph = ({
  title,
  cpuGraphMinutes,
  memoryGraphMinutes,
  setCpuGraphMinutes,
  setMemoryGraphMinutes,
  data,
}) => {
  const [graphDisplay, setGraphDisplay] = useState(null);
  const [graphTitleDisplay, setGraphTitleDisplay] = useState('');

  //creates a mutable object to attach our graph to
  const chartRef = useRef(null);

  const handleSelectDisplay = (mins) => {
    console.log(
      `selectDisplay func setting display to ${mins} minutes for ${title}!`
    );
    if (title === 'CPU Usage') {
      setCpuGraphMinutes(mins);
    } else if (title === 'Memory Usage') {
      setMemoryGraphMinutes(mins);
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
  }, [data, title]);

  return (
    <div>
      <h2 variant='h5'>{`Average ${title}`}</h2>
      <div className='sliderContainer'>
        <div className='tabs'>
          {[1440, 60, 10].map((mins) => (
            <div key={mins}>
              <input
                className='radio'
                type='radio'
                id={`radio-${mins}-${title}`}
                name={`tabs-${title}`}
                checked={
                  (title === 'CPU Usage'
                    ? cpuGraphMinutes
                    : memoryGraphMinutes) === mins
                }
                onChange={() => handleSelectDisplay(mins)}
              />
              <label htmlFor={`radio-${mins}-${title}`} className='tab'>
                {mins === 1440
                  ? '24 Hours'
                  : mins === 60
                  ? '1 Hour'
                  : '10 Minutes'}
              </label>
            </div>
          ))}
          <span
            className='graphSlider'
            style={{
              transform: `translateX(${
                (title === 'CPU Usage'
                  ? cpuGraphMinutes
                  : memoryGraphMinutes) === 1440
                  ? 0
                  : (title === 'CPU Usage'
                      ? cpuGraphMinutes
                      : memoryGraphMinutes) === 60
                  ? 100
                  : 200
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
