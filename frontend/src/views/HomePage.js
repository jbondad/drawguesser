import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  FormGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setInLobby } from "../features/authSlice";
import profilePic from "../images/profilePic.jpg";
import socket from "../socket/socket";
import { setPlayerList, setRoomCode } from "../features/lobbySlice";

export default function HomePage() {
  const user = useSelector((state) => state.auth.user);
  const [gameCode, setGameCode] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("joinSuccess", () => {
      dispatch(setInLobby());
      navigate("/Lobby");
    });

    socket.on("roomCode", (data) => {
      dispatch(setRoomCode(data));
    });

    socket.on("playerListUpdate", (data) => {
      dispatch(setPlayerList(data));
    });
  }, []);

  function handleLogout() {
    localStorage.clear();
    dispatch(logout());
    navigate("/Login");
  }

  function createGame() {
    console.log("creating game");
    const userInfo = {
      _id: user.id,
      username: user.username,
    };
    dispatch(setInLobby());
    socket.emit("createGame", userInfo);

    navigate("/Lobby");
  }

  function joinGame() {
    const userInfo = {
      _id: user.id,
      username: user.username,
    };
    socket.emit("joinGame", { user: userInfo, roomCode: gameCode });
  }

  return (
    <Container maxWidth="lg">
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
          padding: "40px 40px",
          outline: "black solid 1px",
          width: 1100,
          height: 600,
          margin: "20px auto",
        }}
      >
        <Typography variant="h4">{user.username}</Typography>
        <div>
          <img src={profilePic} width="150" height="150" />
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "3em",
            width: "80%",
          }}
        >
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            onClick={() => createGame()}
          >
            Create Game
          </Button>

          <Button type="submit" variant="outlined" color="primary" onClick={() => navigate("/Leaderboard")}>
            View Leaderboard
          </Button>

          <Button
            type="submit"
            variant="outlined"
            color="error"
            onClick={() => navigate("/ChangePassword")}
          >
            Change Password
          </Button>
          <Button
            type="submit"
            variant="outlined"
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
        <div>
          <FormGroup row>
            <TextField
              size="small"
              autoComplete="off"
              variant="outlined"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              placeholder="ENTER CODE"
            />
            <Button
              onClick={() => joinGame()}
              variant="contained"
              disableElevation
            >
              JOIN GAME
            </Button>
          </FormGroup>
        </div>
      </Paper>
    </Container>
  );
}
