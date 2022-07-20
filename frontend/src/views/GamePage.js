import React, { useEffect, useState } from "react";
import socket from "../socket/socket";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Button,
  TextField,
  Backdrop,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  setPlayerList,
  setRoomCode,
  setGame,
  setMessages,
} from "../features/lobbySlice";
import { useSelector } from "react-redux";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import Canvas from "../components/Canvas";
import { state } from "../constants/gameStates";
import { TwitterPicker } from "react-color";
import EraserIcon from "../components/EraserIcon";

export default function GamePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lobby = useSelector((state) => state.lobby);
  const game = useSelector((state) => state.lobby.game);
  const messageList = useSelector((state) => state.lobby.messageList);
  const user = useSelector((state) => state.auth.user);
  const [time, setTime] = useState("-");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const colors = [
    "#000000",
    "#FF0000",
    "#008000",
    "#FFFF00",
    "#A52A2A",
    "#FFA500",
    "#808080",
    "#800080",
    "#FFC0CB",
    "#0000FF",
  ];

  const [showBackdrop, setShowBackdrop] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (
      game.state === state.GAME_STATE_CHOOSING_WORD ||
      game.state === state.GAME_STATE_END
    ) {
      setShowBackdrop(true);
    } else {
      setShowBackdrop(false);
    }
  }, [game.state]);

  useEffect(() => {
    socket.on("roomCode", (data) => {
      dispatch(setRoomCode(data));
    });

    socket.on("playerListUpdate", (data) => {
      dispatch(setPlayerList(data));
    });

    socket.on("gameUpdate", (data) => {
      console.log("game update", data);
      dispatch(setGame(data));
    });

    socket.on("messageUpdate", (data) => {
      console.log("message update", data);
      dispatch(setMessages(data));
    });

    socket.on("timer", (counter) => {
      setTime(counter);
    });
  }, []);

  function renderWordOptions() {
    return (
      <Backdrop
        sx={{
          position: "absolute",
          zIndex: 1,
        }}
        open={showBackdrop}
      >
        {game.currentDrawer == user.username ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1em",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "white",
                textShadow:
                  "0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black",
              }}
            >
              Choose a word to draw!
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "3em",
              }}
            >
              <Button  variant="contained" onClick={(e) => chooseWord(game.wordOptions[0])}>
                {game.wordOptions[0]}
              </Button>
              <Button variant="contained"  onClick={(e) => chooseWord(game.wordOptions[1])}>
              {game.wordOptions[1]}
              </Button>
              <Button variant="contained"  onClick={(e) => chooseWord(game.wordOptions[2])}>
              {game.wordOptions[2]}
              </Button>
            </Box>
          </Box>
        ) : (
          <div>
            <Typography
              variant="h4"
              sx={{
                color: "white",
                textShadow:
                  "0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black",
              }}
            >
              {game.currentDrawer} is choosing a word.
            </Typography>
          </div>
        )}
      </Backdrop>
    );
  }

  function chooseWord(word) {
    const data = {
      code: lobby.roomCode,
      word: word,
    };
    socket.emit("wordChosen", data);
  }

  function renderGameOver() {
    return (
      <Backdrop
        sx={{
          position: "absolute",
          zIndex: 1,
        }}
        open={showBackdrop}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "white",
              textShadow:
                "0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black",
            }}
          >
            Gameover {game.winner} has won!
          </Typography>
          <Button variant="contained">Go back to home page</Button>
        </Box>
      </Backdrop>
    );
  }

  function renderMessages() {
    const listItems = messageList.map((data, index) => {
      if (!data.correctGuess || data.username === user.username || data.username === game.currentDrawer) {
        return (
          <ListItem sx={{ padding: 0, paddingLeft: 1 }} key={index}>
            <ListItemText>
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: data.username == "SERVER" ? "#0096FF" : "black",
                }}
                display="inline"
              >
                {data.username}: {data.message}
              </Typography>
            </ListItemText>
          </ListItem>
        );
      }
    });
    return listItems;
  }
  function handleSubmit() {
    socket.emit("newMessage", {
      code: lobby.roomCode,
      _id: user.id,
      username: user.username,
      message: message,
    });
    setMessage("");
  }

  function hiddenWord() {
    if (game.word == "") {
      return "_";
    }
    if (
      game.currentDrawer === user.username ||
      game.state === state.GAME_STATE_CHOOSING_WORD
    ) {
      return game.word;
    }
    return "_".repeat(game.word.length);
  }

  function renderUsername(username) {
    if (username == user.username) {
      return username + "(me)";
    } else return username;
  }

  function renderCanvasOverlay() {
    if (game.state === state.GAME_STATE_END) {
      return renderGameOver();
    } else if (game.state === state.GAME_STATE_CHOOSING_WORD) {
      return renderWordOptions();
    }
  }

  function renderUsers() {
    const userList = lobby.playerList;
    userList.slice().sort((a, b) => (a.score > b.score ? 1 : -1));
    const listItems = userList.map((data, index) => (
      <ListItem sx={{ display: "flex", justifyContent: "center" }} key={index}>
        <Typography>
          {renderUsername(data.username)} Points: {data.score}{" "}
        </Typography>
      </ListItem>
    ));
    return listItems;
  }
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
          <Typography color="white" variant="h3">Draw Guesser</Typography>
        </Box>
        <Box
          sx={{
            flexGrow: 1.3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid black",
            backgroundColor: "#E8E8E8",
            borderRadius: "7px",
            padding: "0 1.5em 0 1.5em",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
            <AccessTimeIcon> </AccessTimeIcon>
            <Typography variant="h6">{time}</Typography>
          </div>
          <div>
            <Typography
              sx={{ letterSpacing: "2px", fontWeight: "bold" }}
              variant="h5"
            >
              {hiddenWord()}
            </Typography>
          </div>
          <div>
            <Typography variant="h6">
              Round {game.currentRound} of {game.numberOfRounds}
            </Typography>
          </div>
        </Box>
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
          <List
            sx={{
              padding: 0,

              "& li:nth-child(odd)": {
                backgroundColor: "#E8E8E8",
              },
            }}
          >
            {renderUsers()}
          </List>
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
          <Box
            sx={{
              border: "1px solid black",
              borderRadius: "5px",
              backgroundColor: "white",
              height: "600px",
              position: "relative",
            }}
          >
            {renderCanvasOverlay()}
            <Canvas color={strokeColor} strokeWidth={strokeWidth} />
          </Box>
          <div
            style={{
              display: "flex",
              gap:'10px',
              backgroundColor: '#E8E8E8',
              padding: '1em',
              border: "1px solid black",
              borderRadius: "5px",
            }}
          >
            <TwitterPicker
              onChangeComplete={(color) => setStrokeColor(color.hex)}
              colors={colors}
            ></TwitterPicker>
            <Button sx={{maxWidth: '50px', maxHeight: '50px', backgroundColor:'white', '&:hover': {
background: "white",    
             
}}} variant="outlined" onClick={()=> setStrokeColor('white')}>
            <EraserIcon size={30}></EraserIcon>
            </Button>
          </div>
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
          <Box
            sx={{
              flexGrow: "1",
              maxHeight: "765px",
            }}
          >
            <List
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "0px",
                position: "relative",
                maxHeight: "100%",
                width: "100%",
                overflow: "auto",
                "& li:nth-child(odd)": {
                  backgroundColor: "#E8E8E8",
                },
              }}
            >
              {renderMessages()}
            </List>
          </Box>

          <TextField
            sx={{
              marginTop: "auto",
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="false"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                setMessage(e.target.value);
                handleSubmit();
              }
            }}
          ></TextField>
        </Box>
      </Box>
    </Container>
  );
}
