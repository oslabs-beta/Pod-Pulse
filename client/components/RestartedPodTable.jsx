import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RestartedPodRow from './RestartedPodRow';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

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
      <h2>Restarted Pods</h2>
    <TableContainer className='tabContain' sx={{backgroundColor: '#242424' }} component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead id='tblhd'>
          <StyledTableRow id='str'>
              <StyledTableCell>Pod Name</StyledTableCell>
              <StyledTableCell>Time of Deletion</StyledTableCell>
              <StyledTableCell>Pod Namespace</StyledTableCell>
              <StyledTableCell>Metric Type</StyledTableCell>
              <StyledTableCell>Metric at Restart</StyledTableCell>
              <StyledTableCell>Restart Threshold</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default RestartedPodTable;