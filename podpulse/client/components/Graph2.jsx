import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables} from 'chart.js';

//registering all default components that may be used to create the graph but once we know exactly what we will use we can specify them directly to make it more optimized
Chart.register(...registerables);

const Graph = ({ title, graphHours, setGraphHours }) => {
    const {graphDisplay, setGraphDisplay} = useState(null);
  const [graphTitleDisplay, setGraphTitleDisplay] = useState('No Graph to display!');

  //creates a mutable object to attach our graph to
  const chartRef = useReff(null);
  
  
  function selectDisplay(hours) {
    console.log(`selectDisplay func setting display to ${hours} hours!`);
    if (graphHours !== hours) setGraphHours(hours);
  }

  // let graphDisplay = 'No Graph to display!';

  useEffect(() => {
    const fetchData = async () => {
        const query = `sum(rate(container_cpu_usage_seconds_total[${graphHours}h])) by (pod)`;
        const res = await fetch(INSERT URL FOR REQUEST);
        const data = await response.json();
        return data;
    };

    const renderChart = async () => {
        const data = await fetchData();
        if (!data) setGraphTitleDisplay('No Data Available');
        return
    };
    const labels = data.map((item) => item.metric.pod);
    const cpuUsages = data.map((item) => parseFloat(item.value[2]));

    if (graphDisplay) graphDisplay.destroy();

    const newGraphDisplay = new Chart(chartRef.current, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'CPU Usage',
                data: cpuUsages,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true;
                }
            }
        }
    })
    setGraphDisplay(newGraphDisplay);
};
console.log(`Fetching data for ${graphHours} hours`);
renderChart();
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
