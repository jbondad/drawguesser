import React, { useState } from "react";
import { TextField, Paper, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { changePassword } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleChangePassword() {
    const payload = {
      username: user.username,
      currentPassword,
      newPassword,
    };
    const response = await changePassword(payload);
    console.log(response);
    if (response.success) {
      const notify = () =>
        toast.success(response.success, {
          toastId: "loggedIn",
        });
      notify();
    } else {
      const notify = () =>
        toast.error(response.error, {
          toastId: "invalid",
        });
      notify();
    }

    setCurrentPassword("");
    setNewPassword("");
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
          padding: "2em 1em",
          width: 400,
          height: 500,
          margin: "20px auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            paddingTop: "1em",
            color: "#3f51b5",
          }}
          component="h4"
        >
          Change your password
        </Typography>
        <TextField
          label="Enter Current Password"
          variant="outlined"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="off"
        />
        <TextField
          label="Enter New Password"
          variant="outlined"
          inputa
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="off"
        />
        <div>
          <Button
            type="submit"
            variant="contained"
            color="error"
            onClick={handleChangePassword}
          >
            Change password
          </Button>
        </div>

        <Button
          type="submit"
          sx={{
            marginTop: "auto",
          }}
          variant="contained"
          color="primary"
          onClick={() => navigate("/HomePage")}
        >
          Back to Home page
        </Button>
      </Paper>
    </>
  );
}
