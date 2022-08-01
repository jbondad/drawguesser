import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  ListItem,
  List,
} from "@mui/material";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import { toast } from "react-toastify";
import GameSettings from "../components/GameSettings";

import {
  setPlayerList,
  setRoomCode,
  setGame,
  setMessages,
  setHost,
} from "../features/lobbySlice";

export default function Lobby() {
  const user = useSelector((state) => state.auth.user);
  const lobby = useSelector((state) => state.lobby);

  const [rounds, setRounds] = React.useState(3);

  const handleSelectRounds = (event) => {
    setRounds(event.target.value);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function isHost() {
    return lobby.host === user.id;
  }

  useEffect(() => {
    socket.on("roomCode", (data) => {
      dispatch(setRoomCode(data));
    });

    socket.on("host", (data) => {
      dispatch(setHost(data));
    });

    socket.on("startedGame", () => {
      navigate("/GamePage");
    });

    socket.on("playerListUpdate", (data) => {
      dispatch(setPlayerList(data));
    });

    socket.on("messageUpdate", (data) => {
      dispatch(setMessages(data));
    });

    socket.on("gameUpdate", (data) => {
      dispatch(setGame(data));
    });

    socket.on("roomDeleted", () => {
      const notify = () =>
        toast.error("Host left the lobby.", {
          toastId: "error",
        });
      notify();
      navigate("/HomePage");
    });
  }, []);

  function handleGameStart() {
    socket.emit("startGame", { code: lobby.roomCode, rounds: rounds });
  }

  function renderUsers() {
    const userList = lobby.playerList;
    userList.slice().sort((a, b) => (a.score > b.score ? 1 : -1));
    const listItems = userList.map((data, index) => (
      <ListItem sx={{ display: "flex", justifyContent: "center" }} key={index}>
        <Typography>{data.username}</Typography>
      </ListItem>
    ));
    return <List>{listItems}</List>;
  }

  return (
    <Container sx={{ display: "flex" }} maxWidth="lg">
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
          padding: "40px 40px",
          outline: "black solid 1px",
          width: 500,
          height: 600,
          margin: "20px auto",
        }}
      >
        <div>
          <Typography variant="h4">Players</Typography>
        </div>
        <Box sx={{ flexGrow: 1 }}>{renderUsers()}</Box>
      </Paper>

      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
          padding: "40px 40px",
          outline: "black solid 1px",
          width: 300,
          height: 300,
          margin: "20px auto",
        }}
      >
        <Typography variant="h5">Room Code: {lobby.roomCode}</Typography>
        <Typography>Waiting for host to start...</Typography>
        {isHost() && (
          <>
            <GameSettings
              handleChange={handleSelectRounds}
              rounds={rounds}
            ></GameSettings>
            <Button
              type="submit"
              variant="contained"
              color="success"
              onClick={() => handleGameStart()}
            >
              Start Game
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}
