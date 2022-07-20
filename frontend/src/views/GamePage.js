import React, { useEffect } from "react";
import { Chat } from "../components/Chat";
import socket from "../socket/socket";
import { useDispatch } from "react-redux";
import { Box, Container, Typography} from "@mui/material";
import { setPlayerList, setRoomCode, setGame } from "../features/lobbySlice";
import Game from "../components/Game";
import GameHeader from "../components/GameHeader";
import Users from "../components/Users";

export default function GamePage() {
  const dispatch = useDispatch();

  
  useEffect(() => {
    socket.on("roomCode", (data) => {
      dispatch(setRoomCode(data));
    });

    socket.on("playerListUpdate", (data) => {
      dispatch(setPlayerList(data));
    });

    socket.on("gameUpdate", (data) => {
      dispatch(setGame(data));
    });
  }, []);


  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        maxWidth: "1700px",
        display: "flex",
        flexDirection: "column",
        gap: "7px",
      }}
    >
      <Box
        sx={{
          height: "140px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flexGrow: 2,
            display: "flex",
            alignItems: "center",
            padding: 0,
            margin: 0,
          }}
        >
          <Typography color="white" variant="h3">
            Draw Guesser
          </Typography>
        </Box>
        <GameHeader />
      </Box>

      <Box
        sx={{
          flexGrow: "1",
          display: "flex",
          gap: "7px",
        }}
      >
        <Box
          sx={{
            flexGrow: "1",
            backgroundColor: "white",
            border: "1px solid black",
            borderRadius: "7px",
          }}
        >
          <Users/>
        </Box>
        <Box
          sx={{
            flexGrow: "3",
            maxWidth: "1000px",
            borderRadius: "7px",
            display: "flex",
            flexDirection: "column",
            gap: "1em",
            alignItems: "center",
          }}
        >
          <Game />
        </Box>
        <Box
          sx={{
            flexGrow: "1",
            backgroundColor: "white",
            border: "1px solid black",
            borderRadius: "7px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Chat />
        </Box>
      </Box>
    </Container>
  );
}
