import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import logoDesign from '../assets/logoDesign.png';
import logoSlogan from '../assets/logoSlogan.png';

function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed' sx={{ backgroundColor: '#242424' }}>
        <Toolbar
          sx={{
            backgroundColor: '#242424',
            borderRadius: '8px',
          }}
        >
          <img
            src={logoDesign}
            alt='PodPulse Logo'
            className='logo heartbeat'
            style={{
              width: '40px',
              height: 'auto',
              margin: '0.5rem 1.0rem',
              transition: 'filter 0.3s',
              filter: 'grayscale(10%)',
            }}
          />
          <img
            src={logoSlogan}
            alt='PodPulse - Your DevOps Companion'
            width='500px'
            height='auto'
            margin='0.5rem 1.0rem'
          />

          <Box sx={{ marginLeft: 'auto' }}>
            <Button
              variant='text'
              sx={{
                color: '#adadad',
                '&:hover': {
                  backgroundColor: '#54abb4',
                },
                margin: '0px 10px',
              }}
            >
              Previous Configs
            </Button>
            <Button
              variant='text'
              sx={{
                color: '#adadad',
                '&:hover': {
                  backgroundColor: '#54abb4',
                },
                margin: '0px 10px',
              }}
            >
              More Details
            </Button>
            <Button
              sx={{
                color: '#adadad',
                '&:hover': {
                  backgroundColor: '#54abb4',
                },
                margin: '0px 10px',
              }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .logo:hover {
          animation: pulse 0.6s infinite;
          filter: grayscale(0%);
        }
      `}</style>
      <Box sx={{ marginTop: '64px' }}></Box>
    </Box>
  );
}

export default Navbar;
