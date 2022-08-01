import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function GameSettings({ rounds, handleChange }) {
  return (
    <FormControl fullWidth>
      <InputLabel>Rounds</InputLabel>
      <Select label="Rounds" value={rounds} onChange={handleChange}>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={5}>5</MenuItem>
      </Select>
    </FormControl>
  );
}
