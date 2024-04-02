import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import userContext from "../contexts/UserContext";
import SymImg from "./SymImg";
import { Item } from "../common/models/item";
import { Symbol } from "../common/models/symbol";

const Footer: React.FC = () => {
  return (
    <AppBar position="static" style={{ fontSize: 40 }}>
      <Container maxWidth="xl">
        <Toolbar>
          <Link href="/about" sx={{ mr: 2, ml: 2 }}>
            <Typography variant="h6">About</Typography>
          </Link>
          <Link href="/faq" sx={{ mr: 2, ml: 2 }}>
            <Typography variant="h6">FAQ</Typography>
          </Link>
          <Link
            href="https://store.steampowered.com/app/1404850/Luck_be_a_Landlord/"
            sx={{ mr: 2, ml: 2 }}
          >
            <Typography variant="h6">
              <SymImg tile={Symbol.Coin} textAlign />
              Buy from Steam
            </Typography>
          </Link>
          <Link
            href="https://github.com/naterarmstrong/luck-be-a-statlord"
            sx={{ mr: 2, ml: 2 }}
          >
            <Typography variant="h6">Source Code</Typography>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Footer;
