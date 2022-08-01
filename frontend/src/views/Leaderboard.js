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
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { leaderboard } from "../api/user";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await leaderboard();
      setLeaderboardData(data.leaderboard);
    };

    fetchData().catch(console.error);
  }, []);

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
          width: "50%",
          height: "100%",
          margin: "20px auto",
        }}
      >
        <Typography variant="h4">Leaderboard</Typography>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
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
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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

        <Button variant="contained" onClick={() => navigate("/HomePage")}>
          Back to home
        </Button>
      </Paper>
    </Container>
  );
}
