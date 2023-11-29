import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AppBar, Box, Button, Card, CardContent, CardMedia, Container, Grid, Link, Snackbar, TextField, Toolbar, Typography } from "@mui/material";
import React from "react";
import { billionaire } from "../utils/symbol";

const Header: React.FC = () => {
    const navigate = useNavigate();


    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar>
                    <Box component="img" style={{ width: "80px" }} src={billionaire} />
                    <Link href="/upload" sx={{ mr: 2, ml: 2 }}>
                        Upload Runs
                    </Link>
                    <Box sx={{ flexGrow: 2 }} />
                    <Link href="/login">
                        Login
                    </Link>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
