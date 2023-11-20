import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, CardMedia, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import YoutubePreview from "../components/YoutubePreview"

const CreateSession: React.FC = () => {
  const navigate = useNavigate();
  const [newUrl, setNewUrl] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [videoId, setVideoId] = useState("");

  const createSession = async () => {
    let data = {
      videoUrl: newUrl,
      ...(sessionName !== "" && { name: sessionName })
    };

    const fetchArgs = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };
    const response = await fetch('http://localhost:3001/session', fetchArgs);
    if (response.status !== 201) {
      // TODO: bubble this up to user
      console.error("Failed to create session");
      return
    }
    const jsonData = await response.json();
    console.log(jsonData);
    navigate(`/watch/${jsonData.id}`);
  };

  const handleUrlChange = (newUrl: string) => {
    const videoId = extractVideoID(newUrl);
    setVideoId(videoId)
  };

  // Video ID extraction regex from [here](https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url)
  const extractVideoID = (url: string) => {
    // TODO: Handle case where the youtube part of the URL is missing as well. This does not catch all malformed IDs
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match.length >= 7 && match[7].length === 11) ? match[7] : "";
  };


  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Box width="100%" maxWidth={600} display="flex" gap={1} marginTop={1}>
        <TextField
          label="Session Name"
          variant="outlined"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Youtube URL"
          variant="outlined"
          value={newUrl}
          onChange={(e) => { setNewUrl(e.target.value); handleUrlChange(e.target.value); }}
          fullWidth
        />
        <Button
          disabled={newUrl === ""}
          onClick={createSession}
          size="small"
          variant="contained"
          sx={{ minWidth: 100 }}
        >
          Create a session
        </Button>
      </Box>

      <Box width="100%" />

      <Grid item>
        {newUrl !== "" && <YoutubePreview videoId={videoId} />}
      </Grid>
    </Grid>
  );
};

export default CreateSession;
