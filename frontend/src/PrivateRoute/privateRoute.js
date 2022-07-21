import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const loggedIn = localStorage.getItem("user") !== null;
  const lobby = useSelector((state) => state.lobby);
  const inLobby = lobby.roomCode !== "";

  if(loggedIn && inLobby){
    return children;
  } else if (loggedIn && !inLobby) {
    return <Navigate to="/HomePage" />;
  } 

  return <Navigate to="/Login" />;
};

export default PrivateRoute;
