import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AppBar, Box, Button, Card, CardContent, CardMedia, Container, Grid, Link, Menu, MenuItem, Snackbar, TextField, Toolbar, Typography } from "@mui/material";
import React from "react";
import { billionaire } from "../utils/symbol";
import userContext from "../contexts/UserContext";
import SymImg from "./SymImg";
import { Item } from "../common/models/item";
import { Symbol } from "../common/models/symbol";

const Header: React.FC = () => {
    const navigate = useNavigate();

    const { username, loggedIn, userId, setUser } = useContext(userContext);

    const [toolsAnchorEl, setToolsAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(toolsAnchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setToolsAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setToolsAnchorEl(null);
    };


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
                    <Button id="tools-button" onClick={handleClick} sx={{ mr: 2, ml: 2, textShadow: "inherit", textTransform: "none", border: "none", textDecoration: "underline", textDecorationColor: "rgba(144, 202, 249, 0.4)", '&:hover': { textDecoration: "underline", textDecorationColor: "rgba(144, 202, 249, 0.4)" } }} variant="outlined">
                        <Typography variant="h6" lineHeight={1}>
                            Tools
                        </Typography>
                    </Button>
                    <Menu
                        id="tools-menu"
                        anchorEl={toolsAnchorEl}
                        open={Boolean(toolsAnchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => { handleClose(); navigate("/purplePepperCalculator"); }}><SymImg tile={Item.PurplePepper} style={{ marginRight: 2 }} /> Purple Pepper Calculator</MenuItem>
                        <MenuItem onClick={() => { handleClose(); navigate("/crabCalculator"); }}><SymImg tile={Symbol.Crab} style={{ marginRight: 8 }} /> Crab Calculator</MenuItem>
                    </Menu>
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
