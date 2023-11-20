import { Alert, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface YoutubeCardProps {
    videoId: string
}

const YOUTUBE_API_KEY = "AIzaSyBWBOsuCOs8zWqDTousHe63wtqfevJJUP4";

type TitleStatus = "NOT REQUESTED" | "ERROR" | "NOT FOUND" | "SUCCESS";

type TitleInfo = {
    status: TitleStatus,
    title: string,
};

const YoutubePreview: React.FC<YoutubeCardProps> = ({ videoId }) => {
    const [title, setTitle] = useState<TitleInfo>({ title: "", status: "NOT REQUESTED" });

    useEffect(() => {
        const fetchTitle = async () => {
            const baseURL = "https://www.googleapis.com/youtube/v3/videos";
            const params = new URLSearchParams();
            params.append("id", videoId);
            params.append("key", YOUTUBE_API_KEY);
            params.append("fields", "items(id,snippet(title))");
            params.append("part", "snippet");

            // TODO: use axios
            const response = await fetch(baseURL + "?" + params.toString());
            if (!response.ok) {
                setTitle({ title: "", status: "ERROR" });
                return;
            }
            const jsonData = await response.json();
            const items = jsonData.items;

            if (items.length !== 1) {
                setTitle({ title: "", status: "NOT FOUND" });
                return;
            }
            setTitle({ title: items[0].snippet.title, status: "SUCCESS" });
        }


        if (videoId === "") {
            setTitle({ title: "", status: "NOT REQUESTED" });
        } else {
            fetchTitle().catch(console.error);
        }
    }, [videoId])

    const YoutubeCard = () => (
        <Card sx={{ width: 480 }}>
            <CardMedia
                sx={{ height: 250 }}
                image={"https://i.ytimg.com/vi/" + videoId + "/sddefault.jpg"}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title.title}
                </Typography>
            </CardContent>
        </Card>);

    const SelectView = () => {
        if (title.status === "SUCCESS") {
            return <YoutubeCard />;
        } else if (videoId === "") {
            return <Alert severity="error">Youtube URL is malformed!</Alert>;
        } else if (title.status === "ERROR") {
            return <Alert severity="error">Error accessing Youtube!</Alert>;
        } else if (title.status === "NOT FOUND") {
            return <Alert severity="error">Video not found</Alert>;
        } else {
            return null;
        }
    }

    return <SelectView />;
}

export default YoutubePreview;