import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import logoDesign from '../assets/logoDesign.png';

function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' sx={{ backgroundColor: '#242424' }}>
        <Toolbar sx={{ backgroundColor: '#adadad', borderRadius: '8px' }}>
          <img
            src={logoDesign}
            alt='Logo'
            style={{
              width: '50px',
              height: 'auto',
              margin: '10px',
            }}
          />
          <Button variant='text' sx={{ color: '#242424' }}>
            More Details
          </Button>
          <Button sx={{ color: '#242424' }}>Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
