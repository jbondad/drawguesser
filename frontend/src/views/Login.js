import React, { useState } from "react";
import { TextField, Paper, Typography, Button } from "@mui/material";
import { login } from "../features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { postLogin } from "../api/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogin() {
    const payload = {
      username,
      password,
    };
    const user = await postLogin(payload);
    if (user.token) {
      dispatch(login(user));
      localStorage.setItem("user", JSON.stringify(user));
      const notify = () =>
        toast.success("Successfully logged in!", {
          toastId: "loggedIn",
        });
      notify();
      navigate("/HomePage");
    } else {
      const notify = () =>
        toast.error("Invalid Login", {
          toastId: "invalid",
        });
      notify();
    }

    setUsername("");
    setPassword("");
  }

  return (
    <>
      <Paper
        elevation={10}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "30px",
          padding: "30px 20px",
          width: 400,
          height: 500,
          margin: "20px auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#3f51b5",
          }}
          component="h4"
        >
          Sign in
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          inputa
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
        />
        <div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Sign in
          </Button>
        </div>
        <Link to="/SignUp">
          <Typography>Don't have an account? Sign up here.</Typography>
        </Link>
      </Paper>
    </>
  );
}
