import React from 'react';
import RestartedPodRow from './RestartedPodRow';

const RestartedPodTable = ({ restartedPods }) => {


  const rows = [];
  restartedPods.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0));
  console.log(restartedPods);
  for (let i = 0; i < Math.min(restartedPods.length, 10); i++) {
    let { timestamp, podName, namespace, label, value, threshold } = restartedPods[i];
    rows.push(<RestartedPodRow key={`${timestamp} ${podName}`} timestamp={new Date(timestamp)} podName={podName} namespace={namespace} label={label} value={value} threshold={threshold} />);
  }
  return (
    <>
      <table>
        <thead>
          <tr>
            <th className="tableHead">Restarted Pods</th>
            <th className="tableHead">Time of Deletion</th>
            <th className="tableHead">Pod Namespace</th>
            <th className="tableHead">Metric Type</th>
            <th className="tableHead">Metric at Restart</th>
            <th className="tableHead">Restart
              Threshold</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </>
  );
};

export default RestartedPodTable;