import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AppBar, Box, Button, Card, CardContent, CardMedia, Container, Grid, Link, Snackbar, TextField, Toolbar, Typography } from "@mui/material";
import React from "react";
import { billionaire } from "../utils/symbol";
import userContext from "../contexts/UserContext";

const Header: React.FC = () => {
    const navigate = useNavigate();

    const { username, loggedIn, userId, setUser } = useContext(userContext);


    return (
        <AppBar position="static" style={{ fontSize: 40 }}>
            <Container maxWidth="xl">
                <Toolbar>
                    <Link href="/" sx={{ mr: 2, ml: 2, mb: 0 }}>
                        <Box component="img" style={{ width: "80px" }} src={billionaire} />
                    </Link>
                    <Link href="/" sx={{ mr: 2, ml: 2 }}>
                        <Typography variant="h6">
                            All Symbols
                        </Typography>
                    </Link>
                    <Link href="/symbolDetails" sx={{ mr: 2, ml: 2 }}>
                        <Typography variant="h6">
                            Symbol Details
                        </Typography>
                    </Link>
                    <Link href="/purplePepperCalculator" sx={{ mr: 2, ml: 2 }}>
                        <Typography variant="h6">
                            Tools
                        </Typography>
                    </Link>
                    <Link href="/upload" sx={{ mr: 2, ml: 2 }}>
                        <Typography variant="h6" color={"green"}>
                            Upload Runs
                        </Typography>
                    </Link>
                    <Box sx={{ flexGrow: 2 }} />
                    {loggedIn ?
                        <Link href={`/profile/${userId}`}><Typography variant="h5">{username}</Typography></Link> :
                        <Link href="/login">Login</Link>}
                </Toolbar>
            </Container>
        </AppBar >
    );
};

export default Header;
