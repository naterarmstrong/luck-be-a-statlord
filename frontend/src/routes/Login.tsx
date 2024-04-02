import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Cookies from "universal-cookie";
import userContext from "../contexts/UserContext";
import { enqueueSnackbar } from "notistack";
import API_ENDPOINT from "../utils/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(userContext);

  const handleClickShowPassword = () =>
    setShowPassword((showPassword) => !showPassword);

  const login = async () => {
    let data = {
      username: username,
      password: password,
    };

    const fetchArgs = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //                'Access-Control-Allow-Origin': 'localhost/*'
      },
      body: JSON.stringify(data),
      mode: "cors" as RequestMode,
      credentials: "include" as RequestCredentials,
    };
    const response = await fetch(`${API_ENDPOINT}/login`, fetchArgs);
    if (!response.ok) {
      if (response.status === 404) {
        enqueueSnackbar(`User does not exist.`, {
          variant: "error",
          style: { fontSize: 35 },
        });
      }
      if (response.status === 401) {
        enqueueSnackbar(`Incorrect password`, {
          variant: "error",
          style: { fontSize: 35 },
        });
      }
      return;
    }
    // TODO: expiration
    const body = await response.json();
    setUser({ username: username, loggedIn: true, userId: body.id });
    const cookies = new Cookies();
    cookies.set("username", username);
    cookies.set("userId", body.id);
    console.log(response);
    enqueueSnackbar("Logged in!", {
      variant: "success",
      style: { fontSize: 35 },
    });
    navigate("/upload");
  };

  const register = async () => {
    let data = {
      username: username,
      password: password,
    };

    const fetchArgs = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      mode: "cors" as RequestMode,
      credentials: "include" as RequestCredentials,
    };
    const response = await fetch(`${API_ENDPOINT}/register`, fetchArgs);
    if (!response.ok) {
      if (response.status === 409) {
        enqueueSnackbar("Username already taken", {
          variant: "error",
          style: { fontSize: 35 },
        });
      }
      return;
    }
    const body = await response.json();
    setUser({ username: username, loggedIn: true, userId: body.id });
    const cookies = new Cookies();
    cookies.set("username", username);
    cookies.set("userId", body.id);
    console.log(response);
    navigate("/upload");
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={1}
    >
      <Grid container alignItems="center" justifyContent="center">
        <TextField
          label="User Name"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ width: "400px" }}
        />
        <Box width="100%" />
        <FormControl variant="outlined" sx={{ width: "400px" }}>
          <InputLabel variant="outlined">Password</InputLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Box width="100%" />
        <Button sx={{ width: "200px" }} variant="contained" onClick={login}>
          Login
        </Button>
        <Button sx={{ width: "200px" }} variant="contained" onClick={register}>
          Register
        </Button>
      </Grid>
    </Box>
  );
};

export default Login;
