import React, { useState } from "react";
import { TextField, Paper, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { registerUser } from "../api/user";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function createAccount() {
    const user = {
      username,
      password,
    };
    const res = await registerUser(user)

    if (res.success) {
      const notify = () =>
        toast.success(res.success, {
          toastId: "success",
        });
      notify();
    } else {
      const notify = () =>
      toast.error(res.error, {
        toastId: "error",
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
        Create an Account
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
          onClick={createAccount}
        >
          Sign up
        </Button>
      </div>
      <Link to="/Login">
        <Typography>Have an account? Sign in here.</Typography>
      </Link>
    </Paper>
  </>
  );
}
