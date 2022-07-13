import { Container, Paper, Typography, Box, Button, TextField, FormGroup } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../features/authSlice'
import profilePic from '../images/profilePic.jpg'

export default function HomePage() {

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout(){
    localStorage.clear();
    dispatch(logout());
    navigate("/Login");
  }

  useEffect(()=> {
    console.log(user.username);
  },[user])
  return (
    <Container maxWidth="lg">
      <Paper 
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "40px",
                padding: "40px 40px",
                outline: "black solid 1px",
                width: 1100,
                height: 600,
                margin: "20px auto",
              }}>
        <Typography
          variant="h4"
        >
        {user.username}
        </Typography>
        <div>
          <img src={profilePic} width="150" height="150"/>
        </div>
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          gap: "3em",
          width: "500px"
        }}>
                          <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                >
                  Create Game
                </Button>

                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                >
                  View Leaderboard
                </Button>
                <Button
                  type="submit"
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                >
                  Logout
                </Button>

        </Box>
        <div >
        <FormGroup row>
  <TextField size='small' autoComplete='off' variant="outlined" placeholder="ENTER CODE" />
  <Button variant="contained" disableElevation>
    JOIN GAME
  </Button>
</FormGroup>
                </div>

      </Paper>
    </Container>
  )
}
