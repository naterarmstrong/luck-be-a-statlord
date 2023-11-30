import { Box, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type ProfileStats = {
    total_games: number,
    wins: number,
    guillotine: number,
    beat_rent_1_count: number,
    beat_rent_2_count: number,
    beat_rent_3_count: number,
    beat_rent_4_count: number,
    beat_rent_5_count: number,
    beat_rent_6_count: number,
    beat_rent_7_count: number,
    beat_rent_8_count: number,
    beat_rent_9_count: number,
    beat_rent_10_count: number,
    beat_rent_11_count: number,
    beat_rent_12_count: number,
    beat_rent_13_count: number,
}

const Profile: React.FC = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [stats, setStats] = useState<ProfileStats | undefined>(undefined);

    useEffect(() => {
        const fetchUserName = async () => {
            const response = await fetch(`http://localhost:3001/user/${userId}`);
            if (!response.ok) {
                console.log("Error fetching");
                // User didn't exist
                navigate('/');
            }
            const jsonData = await response.json();
            setName(jsonData.username);
        }

        fetchUserName().catch(console.error);
    }, []);

    useEffect(() => {
        const fetchUserStats = async () => {
            const response = await fetch(`http://localhost:3001/user/${userId}/stats`);
            if (!response.ok) {
                console.log("Error fetching");
                // User didn't exist
                navigate('/');
            }
            const jsonData = await response.json();
            setStats(jsonData[0]);
            console.log(jsonData[0]);
        }

        fetchUserStats().catch(console.error);
    }, []);

    return (
        <Box>
            {name}<br />
            {stats ? `${stats.total_games} total wins` : null}
            {stats ?
                <Typography>
                    Overall win rate: {(100 * stats.wins / stats.total_games).toFixed(0)}%<br />
                    Win rate after rent 1: {(100 * stats.wins / stats.beat_rent_1_count).toFixed(0)}%<br />
                    Win rate after rent 2: {(100 * stats.wins / stats.beat_rent_2_count).toFixed(0)}%<br />
                    Win rate after rent 3: {(100 * stats.wins / stats.beat_rent_3_count).toFixed(0)}%<br />
                    Win rate after rent 4: {(100 * stats.wins / stats.beat_rent_4_count).toFixed(0)}%<br />
                    Win rate after rent 5: {(100 * stats.wins / stats.beat_rent_5_count).toFixed(0)}%<br />
                    Win rate after rent 6: {(100 * stats.wins / stats.beat_rent_6_count).toFixed(0)}%<br />
                    Win rate after rent 7: {(100 * stats.wins / stats.beat_rent_7_count).toFixed(0)}%<br />
                    Win rate after rent 8: {(100 * stats.wins / stats.beat_rent_8_count).toFixed(0)}%<br />
                    Win rate after rent 9: {(100 * stats.wins / stats.beat_rent_9_count).toFixed(0)}%<br />
                    Win rate after rent 10: {(100 * stats.wins / stats.beat_rent_10_count).toFixed(0)}%<br />
                    Win rate after rent 11: {(100 * stats.wins / stats.beat_rent_11_count).toFixed(0)}%<br />
                    Win rate after rent 12: {(100 * stats.wins / stats.beat_rent_12_count).toFixed(0)}%<br />
                </Typography>
                : null}
        </Box>)
}

export default Profile;