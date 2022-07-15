import React, { useEffect } from 'react'
import socket from '../socket/socket';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { setPlayerList, setRoomCode }  from '../features/lobbySlice'
import { useSelector } from 'react-redux';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";



export default function GamePage() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lobby  = useSelector((state) => state.lobby);

  
  useEffect(() => {
    socket.on('roomCode', (data) => {
      console.log('room code is', data);
      dispatch(setRoomCode(data));
    });

    socket.on('playerListUpdate', (data) => {
      console.log('player list update', data);
      dispatch(setPlayerList(data));
    })


  },[])


  function renderUsers() {
    const userList = lobby.playerList;
    const listItems = userList.map((data, index) => (
      <ListItem key={index}>
        <ListItemAvatar>
          <Avatar />
        </ListItemAvatar>
        <ListItemText sx={{color:data.color}} primary={data.username} />
      </ListItem>
    ));
    return listItems;
  }
  return (
      <Container
        maxWidth={false}
        sx={{
          height: '100vh',
          maxWidth: '1600px',
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
        }}
      >
      <Box sx={{
        backgroundColor: 'white',
        height: '80px', 
        border: '1px solid black',
        borderRadius: '7px',
      }}>
        ROOM CODE: {lobby.roomCode}
        
      </Box>

      <Box sx={{
        flexGrow: '1',
        display: 'flex',
        gap: '7px',
      }}>
        <Box
          sx={{
            flexGrow: '1',
            backgroundColor:'white',
            border: '1px solid black',
            borderRadius: '7px',
          }}
        >

<List>{renderUsers()}</List>

        </Box>
        <Box          sx={{
            flexGrow: '3',
            backgroundColor:'white',
            border: '1px solid black',
            borderRadius: '7px',
          }}>
        hi
          </Box>
          <Box          sx={{
            flexGrow: '1',
            backgroundColor:'white',
            border: '1px solid black',
            borderRadius: '7px',
          }}>
          hi
          
          </Box>
      </Box>
              
      </Container>
  )
}
