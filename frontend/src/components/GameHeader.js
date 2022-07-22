import React, { useEffect, useState } from "react";
import socket from "../socket/socket";
import { Box, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useSelector } from "react-redux";
import { state } from "../constants/gameStates";

export default function GameHeader() {
  const game = useSelector((state) => state.lobby.game);
  const user = useSelector((state) => state.auth.user);
  const [time, setTime] = useState("-");

  useEffect(() => {
    socket.on("timer", (counter) => {
      setTime(counter);
    });
  }, []);

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

    let hiddenWord = "";
    for (let i = 0; i < game.word.length; i++) {
      if (game.word[i] === " ") {
        hiddenWord = hiddenWord + " ";
      } else {
        hiddenWord = hiddenWord + "_";
      }
    }

    return hiddenWord;
  }

  return (
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
  );
}
