import { Box } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Profile: React.FC = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");

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
    })

    return (
        <Box>
            {name}
        </Box>)
}

export default Profile;