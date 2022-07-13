
import SignUp from './views/SignUp';
import "@fontsource/roboto";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style.css";
import Login from './views/Login';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  return (
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login/>}>
          </Route>
          <Route path="/SignUp" element={<SignUp/>}>
          </Route>
          <Route path="/" element={<Navigate to="/Login" />}/>

        </Routes>
      </BrowserRouter> 
      <ToastContainer /> 
    </ThemeProvider>
  )
}

export default App;
