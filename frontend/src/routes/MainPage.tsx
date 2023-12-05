import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Symbol } from "../common/models/symbol";
import SymbolStatDisplay from "../components/SymbolStatDisplay";

const MainPage: React.FC = () => {


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
                    Object.keys(Symbol).filter((v: any) => isNaN(Number(v))).map((symbol: any, index, arr) => (
                        <SymbolStatDisplay symbol={symbol} />
                    ))
                }
            </TableBody>
        </Table>
    )
}

export default MainPage;