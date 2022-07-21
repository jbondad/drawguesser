import SignUp from "./views/SignUp";
import "@fontsource/roboto";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./style.css";
import Login from "./views/Login";
import { login } from "./features/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PrivateRoute from "./PrivateRoute/privateRoute";
import HomePage from "./views/HomePage";
import GamePage from "./views/GamePage";
import Lobby from "./views/Lobby";
import { ToastContainer, toast } from "react-toastify";
import socket from "./socket/socket";

import "react-toastify/dist/ReactToastify.css";

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    initializeActiveUser();


    socket.on("error", (errorMsg) => {
      console.log('join failed');
      const notify = () =>
      toast.error(errorMsg, {
        toastId: "invalid",
      });
      notify();
    })

  }, []);

  function initializeActiveUser() {
    const activeUser = localStorage.getItem("user") !== null;

    if (activeUser) {
      const userObject = JSON.parse(localStorage.getItem("user"));
      dispatch(login(userObject));
    }
  }

  return (
    <ThemeProvider theme={customTheme}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/SignUp" element={<SignUp />}></Route>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/HomePage"
            element={
                <HomePage />
            }
          />
          <Route
            path="/GamePage"
            element={
              <PrivateRoute>
                <GamePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/Lobby"
            element={
              <PrivateRoute>
                <Lobby />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
