import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../socket/socket";
import { setMessages } from "../features/lobbySlice";
import {
  List,
  ListItemText,
  ListItem,
  Typography,
  Box,
  TextField,
} from "@mui/material";

export function Chat() {
  const dispatch = useDispatch();

  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const game = useSelector((state) => state.lobby.game);
  const messageList = useSelector((state) => state.lobby.messageList);
  const lobby = useSelector((state) => state.lobby);
  const [message, setMessage] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("messageUpdate", (data) => {
      dispatch(setMessages(data));
      scrollToBottom();
    });
  }, []);

  function handleSubmit() {
    socket.emit("newMessage", {
      code: lobby.roomCode,
      _id: user.id,
      username: user.username,
      message: message,
    });
    setMessage("");
  }

  function renderMessages() {
    const listItems = messageList.map((data, index) => {
      if (
        !data.correctGuess ||
        data.username === user.username ||
        data.username === game.currentDrawer
      ) {
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

  return (
    <>
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
          <div ref={messagesEndRef} />
        </List>
      </Box>

      <TextField
        sx={{
          marginTop: "auto",
        }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        autoComplete="off"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            setMessage(e.target.value);
            handleSubmit();
          }
        }}
      ></TextField>
    </>
  );
}
