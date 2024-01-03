import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Container, Link, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import React from "react";
import userContext from "../contexts/UserContext";
import SymImg from "./SymImg";
import { Item } from "../common/models/item";
import { Symbol } from "../common/models/symbol";

const Header: React.FC = () => {
    const navigate = useNavigate();

    const { username, loggedIn, userId } = useContext(userContext);

    const [toolsAnchorEl, setToolsAnchorEl] = useState<null | HTMLElement>(null);
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
                        <SymImg tile={Symbol.Billionaire} size={80} textAlign omitTooltip />
                    </Link>
                    <Link href="/symbolStats" sx={{ mr: 2, ml: 2 }}>
                        <Typography variant="h6">
                            Symbols
                        </Typography>
                    </Link>
                    <Link href="/itemStats" sx={{ mr: 2, ml: 2 }}>
                        <Typography variant="h6">
                            Items
                        </Typography>
                    </Link>
                    <Link href="/essenceStats" sx={{ mr: 2, ml: 2 }}>
                        <Typography variant="h6">
                            Essences
                        </Typography>
                    </Link>
                    <Link onClick={handleClick} sx={{ mr: 2, ml: 2, textShadow: "inherit" }} component="button">
                        <Typography variant="h6">
                            Tools
                        </Typography>
                    </Link>
                    <Menu
                        anchorEl={toolsAnchorEl}
                        open={Boolean(toolsAnchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => { handleClose(); navigate("/dictionary"); }}> <SymImg tile={Item.AnthropologyDegree} omitTooltip style={{ marginRight: 2 }} />Dictionary</MenuItem>
                        <MenuItem onClick={() => { handleClose(); navigate("/purplePepperCalculator"); }}><SymImg tile={Item.PurplePepper} omitTooltip style={{ marginRight: 2 }} /> Purple Pepper Calculator</MenuItem>
                        <MenuItem onClick={() => { handleClose(); navigate("/crabCalculator"); }}><SymImg tile={Symbol.Crab} omitTooltip style={{ marginRight: 8 }} /> Crab Calculator</MenuItem>
                        <MenuItem onClick={() => { handleClose(); navigate("/eaterCalculator"); }}><SymImg tile={Symbol.EldritchCreature} omitTooltip style={{ marginRight: 8 }} /> Eater Calculator</MenuItem>
                    </Menu>
                    {loggedIn ? <Link href="/upload" sx={{ mr: 2, ml: 2 }}>
                        <Typography variant="h6" color={"green"}>
                            Upload Runs
                        </Typography>
                    </Link> : null}
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
