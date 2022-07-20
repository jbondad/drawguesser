import React, { useEffect, useState } from "react";
import socket from "../socket/socket";
import { Box, Button, Backdrop, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import Canvas from "../components/Canvas";
import { state } from "../constants/gameStates";
import { TwitterPicker } from "react-color";
import EraserIcon from "../components/EraserIcon";

export default function Game() {
  const lobby = useSelector((state) => state.lobby);
  const game = useSelector((state) => state.lobby.game);
  const user = useSelector((state) => state.auth.user);

  const [showBackdrop, setShowBackdrop] = useState(false);
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
              <Button
                variant="contained"
                onClick={(e) => chooseWord(game.wordOptions[0])}
              >
                {game.wordOptions[0]}
              </Button>
              <Button
                variant="contained"
                onClick={(e) => chooseWord(game.wordOptions[1])}
              >
                {game.wordOptions[1]}
              </Button>
              <Button
                variant="contained"
                onClick={(e) => chooseWord(game.wordOptions[2])}
              >
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

  function renderCanvasOverlay() {
    if (game.state === state.GAME_STATE_END) {
      return renderGameOver();
    } else if (game.state === state.GAME_STATE_CHOOSING_WORD) {
      return renderWordOptions();
    }
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

  return (
    <>
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
          gap: "10px",
          backgroundColor: "#E8E8E8",
          padding: "1em",
          border: "1px solid black",
          borderRadius: "5px",
        }}
      >
        <TwitterPicker
          onChangeComplete={(color) => setStrokeColor(color.hex)}
          colors={colors}
        ></TwitterPicker>
        <Button
          sx={{
            maxWidth: "50px",
            maxHeight: "50px",
            backgroundColor: "white",
            "&:hover": {
              background: "white",
            },
          }}
          variant="outlined"
          onClick={() => setStrokeColor("white")}
        >
          <EraserIcon size={30}></EraserIcon>
        </Button>
      </div>
    </>
  );
}
