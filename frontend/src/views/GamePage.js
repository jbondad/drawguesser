import React, { useEffect } from 'react'
import socket from '../socket/socket';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Button } from '@mui/material';
import { setPlayerList, setRoomCode, setGame }  from '../features/lobbySlice'
import { useSelector } from 'react-redux';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import Canvas from '../components/Canvas';



export default function GamePage() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lobby  = useSelector((state) => state.lobby);
  const game  = useSelector((state) => state.lobby.game);
  const messageList  = useSelector((state) => state.lobby.messageList);


  
  useEffect(() => {
    socket.on('roomCode', (data) => {
      dispatch(setRoomCode(data));
    });

    socket.on('playerListUpdate', (data) => {
      dispatch(setPlayerList(data));
    })

    socket.on('gameUpdate', (data) => {
      console.log('game update', data);
      dispatch(setGame(data));
    })


  },[])

  function renderGameStatus() {
    if(game.state === 1){
      return 'WAITING';
    } else if (game.state === 2){
      return game.currentDrawer + ' is drawing';
      } else{
        return "GAME OVER"
      }
    }

  
    function handleGameStart(){
      socket.emit('startGame', lobby.roomCode);
    }

    function handleNextDrawer(){
      socket.emit('nextDrawer', lobby.roomCode);
    }
    

    function renderMessages() {
      const listItems = messageList.map((data, index) => (
        <ListItem
          key={index}
        >
            <ListItemText primary={data.message} />
        </ListItem>
      ));
      return listItems;
    }


  function renderUsers() {
    const userList = lobby.playerList;
    const listItems = userList.map((data, index) => (
      <ListItem key={index}>
        <ListItemText primary={data.username} />
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
        ROOM CODE: {lobby.roomCode}  <br/>
        GAME STATUS: {renderGameStatus()} <br/>
        ROUND: {game.currentRound} / {game.numberOfRounds} <br/>
        CURRENT DRAWER: {game.currentDrawer}
        
        
        
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
            maxWidth: '1000px',
            borderRadius: '7px',
          }}>
        <Canvas height={500} width={800}/>
        <Button variant='outlined' onClick={() => handleGameStart()}>
          START GAME
        </Button>
        <Button variant='outlined'  onClick={() => handleNextDrawer()}>
          NEXT DRAWER
        </Button>
          </Box>
          <Box          sx={{
            flexGrow: '1',
            backgroundColor:'white',
            border: '1px solid black',
            borderRadius: '7px',
          }}>

<List
      sx={{
        display: "flex",
        flexDirection: "column",
        bottom: "0px",
        padding: "0px",
        position: "absolute",
        direction: "rtl",
        maxHeight: "100%",
        overflow: "auto",
        width: "100%",
      }}
    >
      {renderMessages()}
    </List>
          
          </Box>
      </Box>
              
      </Container>
  )
}
