import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Symbol } from "../common/models/symbol";
import SymbolStatDisplay from "../components/SymbolStatDisplay";
import { SymbolStats } from "../components/SymbolStatDisplay";
import AllSymbolStats from "../components/AllSymbolStats";

const MainPage: React.FC = () => {
    const [stats, setStats] = useState<Array<SymbolStats>>([]);

    useEffect(() => {
        const fetchSymbolStats = async () => {
            const response = await fetch(`http://localhost:3001/symbolStats`);
            if (!response.ok) {
                console.log(`Error fetching symbol stats`);
                // User didn't exist
            }
            const jsonData = await response.json();
            setStats(jsonData);
        }

        fetchSymbolStats().catch(console.error);
    }, [])

    return <AllSymbolStats stats={stats} />
}

export default MainPage;