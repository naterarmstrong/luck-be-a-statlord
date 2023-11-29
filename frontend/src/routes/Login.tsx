import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, CardMedia, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, ListItem, OutlinedInput, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, styled } from "@mui/material";
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const confirm = require('../img/confirm.png');
const dud = require('../img/dud.png');


const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((showPassword) => !showPassword);

    const login = async () => {
        let data = {
            username: username,
            password: password,
        };

        const fetchArgs = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //                'Access-Control-Allow-Origin': 'localhost/*'
            },
            body: JSON.stringify(data),
            mode: "cors" as RequestMode,
            credentials: "include" as RequestCredentials,
        };
        const response = await fetch('http://localhost:3001/login', fetchArgs);
        if (response.status !== 200 && response.status !== 201) {
            console.error("AHH GOT AN ERROR", response);
            return
        }
        console.log(response);
        // navigate('/upload');
    }

    const register = async () => {
        let data = {
            username: username,
            password: password,
        };

        const fetchArgs = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': 'http://localho.st'
            },
            body: JSON.stringify(data),
            mode: "cors" as RequestMode,
            credentials: "include" as RequestCredentials,
        };
        const response = await fetch('http://localhost:3001/register', fetchArgs);
        if (response.status !== 201) {
            console.error("AHH GOT AN ERROR", response);
            return
        }
        console.log(response);
        // navigate('/upload');
    }


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
                        type={showPassword ? 'text' : 'password'}
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