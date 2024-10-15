import React from 'react';
import DeletedPodRow from './DeletedPodRow';

const DeletedPodTable = ({ deletedPods }) => {


  const rows = [];
  deletedPods.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0));
  console.log(deletedPods);
  for (let i = 0; i < Math.min(deletedPods.length, 10); i++) {
    let { timestamp, podName, namespace, label, value, threshold } = deletedPods[i];
    rows.push(<DeletedPodRow key={`${timestamp} ${podName}`} timestamp={new Date(timestamp)} podName={podName} namespace={namespace} label={label} value={value} threshold={threshold} />);
  }
  return (
    <table>
      <thead>
        <tr>
          <th className="tableHead">Pod Name</th>
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
  );
};

export default DeletedPodTable;