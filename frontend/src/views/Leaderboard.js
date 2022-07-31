import {
    Container,
    Paper,
    Typography,
    Table,
    TableHead,
    TableContainer,
    TableBody,
    TableRow,
    TableCell,
    Box,
    Button,
    TextField,
    FormGroup,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { useSelector, useDispatch } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { logout, setInLobby } from "../features/authSlice";
  import profilePic from "../images/profilePic.jpg";
  import socket from "../socket/socket";
  import { setPlayerList, setRoomCode } from "../features/lobbySlice";
  import {  leaderboard } from "../api/user";
  
  
  export default function Leaderboard() {
    const user = useSelector((state) => state.auth.user);
    const [leaderboardData, setLeaderboardData] = useState([]);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const data = await leaderboard();
            setLeaderboardData(data.leaderboard);
          }
        
        fetchData().catch(console.error);

    }, [])

    function createData(
        name,
        calories,
        fat,
        carbs,
        protein,
      ) {
        return { name, calories, fat, carbs, protein };
      }
      
    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
      ];
      
  
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
            width: 500,
            height: 700,
            margin: "20px auto",
          }}
        >
          <Typography variant="h4">Leaderboard</Typography>
          <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell align="right">Wins</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboardData.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell align="right">{row.wins}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Button variant="contained" onClick={()=> navigate("/HomePage")}>
        Back to home
    </Button>
        
        </Paper>
      </Container>
    );
  }
  