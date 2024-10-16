import React from 'react';

const RestartedPodRow = ({ timestamp, namespace, podName, label, value, threshold }) => {
  function formatDate(date) {
    const now = new Date();
    const isToday = (date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear());
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    if (isToday) {
      return time;
    } else {
      const date = date.toLocaleDateString('en-US', {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
      });
      return `${date} ${time}`;
    }
  }
  const formattedDate = formatDate(timestamp);

  return (
    <>
      <tr>
        <th>{podName}</th>
        <td>{formattedDate}</td>
        <td>{namespace}</td>
        <td>{label}</td>
        <td>{Math.round(value*100)/100}%</td>
        <td>{threshold}%</td>
      </tr>
    </>
  );
};

export default RestartedPodRow;


// {
//   timestamp: 2024-10-15T20:16:39.205Z,
//   namespace: 'kube-system',
//   podName: 'etcd-minikube',
//   label: 'Memory',
//   value: '202.38404947916666',
//   threshold: 1
// },