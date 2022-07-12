import React from 'react'
import { TextField, Paper, Typography, Alert, Button, Box } from "@mui/material";
import { Link } from 'react-router-dom';

export default function SignUp() {
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
                required
                autoComplete="off"
              />
              <TextField
                label="Username"
                variant="filled"
                required
                autoComplete="off"
              />
             <TextField
                label="Password"
                type="password"
                variant="filled"
                required
                autoComplete="off"
              />
              <div>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Sign Up
                </Button>
              </div>
              <Link to='/Login'>
              <Typography>
                Already have an account? Log in here.
              </Typography>
              </Link>
            </Paper>
        </>
      );
}
