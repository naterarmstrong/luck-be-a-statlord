import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Symbol } from "../common/models/symbol";
import SymbolStatDisplay from "../components/SymbolStatDisplay";
import { SymbolStats } from "../components/SymbolStatDisplay";
import AllSymbolStats from "../components/AllSymbolStats";

const MainPage: React.FC = () => {
    return <AllSymbolStats />
}

export default MainPage;