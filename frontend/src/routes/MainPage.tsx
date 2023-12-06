import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Symbol } from "../common/models/symbol";
import SymbolStatDisplay from "../components/SymbolStatDisplay";
import { SymbolStats } from "../components/SymbolStatDisplay";

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

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Rarity</TableCell>
                    <TableCell>Win Rate</TableCell>
                    <TableCell>Total Games</TableCell>
                    <TableCell>Shows per game</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    stats.map((v) => <SymbolStatDisplay {...v} />)
                }
            </TableBody>
        </Table>
    )
}

export default MainPage;