import React, { useState } from "react";
import {
  TextField,
  Paper,
  Typography,
  Alert,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { registerUser } from "../api/user";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function createAccount() {
    const user = {
      username,
      password,
      email,
    };
    registerUser(user);

    setUsername("");
    setEmail("");
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
          label="Email"
          variant="filled"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="off"
        />
        <TextField
          label="Username"
          variant="filled"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
        />
        <TextField
          label="Password"
          type="password"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="off"
        />
        <div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={createAccount}
          >
            Sign Up
          </Button>
        </div>
        <Link to="/Login">
          <Typography>Already have an account? Log in here.</Typography>
        </Link>
      </Paper>
    </>
  );
}
