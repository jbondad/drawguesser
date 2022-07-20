import React from "react";

import { Typography, List, ListItem } from "@mui/material";
import { useSelector } from "react-redux";


export default function Users() {
    const lobby = useSelector((state) => state.lobby);
    const user = useSelector((state) => state.auth.user);
  

    function renderUsername(username) {
        if (username == user.username) {
          return username + "(me)";
        } else return username;
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
  )
}
