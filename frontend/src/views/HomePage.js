import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  FormGroup,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/authSlice';
import profilePic from '../images/profilePic.jpg';
import socket from '../socket/socket';

export default function HomePage() {
  const user = useSelector((state) => state.auth.user);
  const [gameCode, setGameCode] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    dispatch(logout());
    navigate('/Login');
  }

  function createGame() 
  { 
    console.log("creating game");
    const userInfo = {
      id: user.id,
      username: user.username,
    }
    socket.emit('createGame', userInfo);
    navigate('/GamePage');
  }


  function joinGame() {
    socket.emit("joinGame", gameCode);
  }

  useEffect(() => {
    console.log(user.username);
  }, [user]);
  return (
    <Container maxWidth='lg'>
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '40px',
          padding: '40px 40px',
          outline: 'black solid 1px',
          width: 1100,
          height: 600,
          margin: '20px auto',
        }}
      >
        <Typography variant='h4'>{user.username}</Typography>
        <div>
          <img src={profilePic} width='150' height='150' />
        </div>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3em',
            width: '500px',
          }}
        >
          <Button type='submit' variant='outlined' color='primary' onClick={()=>createGame()}>
            Create Game
          </Button>

          <Button type='submit' variant='outlined' color='primary'>
            View Leaderboard
          </Button>
          <Button
            type='submit'
            variant='outlined'
            color='error'
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
        <div>
          <FormGroup row>
            <TextField
              size='small'
              autoComplete='off'
              variant='outlined'
              value={gameCode}
              onChange={e => setGameCode(e.target.value)}
              placeholder='ENTER CODE'
            />
            <Button variant='contained' disableElevation>
              JOIN GAME
            </Button>
          </FormGroup>
        </div>
      </Paper>
    </Container>
  );
}
