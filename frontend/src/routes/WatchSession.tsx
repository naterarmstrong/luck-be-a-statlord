import { useEffect, useRef, useState } from "react";
import VideoPlayer, { VideoPlayerHandle } from "../components/VideoPlayer";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Dialog, DialogTitle, FormControl, IconButton, InputLabel, OutlinedInput, TextField, Tooltip } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import PersonIcon from "@mui/icons-material/Person";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import io from "socket.io-client";

import React from "react";
import ChangeVideoDialog from "../components/ChangeVideoDialog";

const WatchSession: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState<string | null>(null);
  const [members, setMembers] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const player = useRef<VideoPlayerHandle | null>(null);
  // The last timestamp for a received state change. We don't send updates within 30ms of a received
  // state change, to avoid clogging up the websocket and overwriting seeks
  let lastReceived = useRef({ timestamp: 0, action: 'none', videoTime: 0 });

  useEffect(() => {
    if (!sessionId) {
      // if session ID doesn't exist, you'll probably want to redirect back to the home / create session page
      navigate('/')
    }

    const fetchSessionInfo = async () => {
      const response = await fetch(`http://localhost:3001/sessions/${sessionId}`);
      if (!response.ok) {
        console.log("Error fetching");
        // TODO: bubble this up to user in a more transparent way
        navigate('/');
        return;
      }
      const jsonData = await response.json();
      setUrl(jsonData.videoUrl);
      jsonData.name && setSessionName(jsonData.name);
    }

    fetchSessionInfo().catch(console.error);

    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    const onConnect = (socketId: string) => {
      console.log(`Connected to socket ${socketId}`);
      newSocket.emit("joinSession", { sessionId });
    };

    const onState = (state: { isPlaying: boolean, videoSeconds: number, videoUrl: string }) => {
      if (!player.current) {
        return;
      }
      console.log(`Received new state.\n  Playing: ${state.isPlaying}\n  Time: ${state.videoSeconds}\n  Previous Playing: ${player.current?.isPlaying()}\n  Previous Time: ${player.current?.getCurrentTime()}\n  URL: ${state.videoUrl}`);
      const changedUrl = (state.videoUrl !== url) && url;
      if (!url) {
        console.log("URL was somehow previously not set...")
        setUrl(state.videoUrl);
      } else if (changedUrl) {
        // No point to changing the state of the player that is about to change
        console.log("Accepting changed URL.")
        setUrl(state.videoUrl);
        return;
      }
      lastReceived.current.timestamp = Date.now();
      lastReceived.current.action = state.isPlaying ? 'play' : 'pause';
      lastReceived.current.videoTime = state.videoSeconds;
      if (state.isPlaying) {
        if (changedUrl || Math.abs(player.current.getCurrentTime() - state.videoSeconds) > 0.5) {
          player.current.playAt(state.videoSeconds);
        } else {
          player.current.playAt(player.current.getCurrentTime());
        }
      } else {
        player.current.pauseAt(state.videoSeconds);
      }
    };
    newSocket.on("connect", () => onConnect(newSocket.id));
    newSocket.on("state", onState);
    newSocket.on("members", (x) => setMembers(x))

    return () => { newSocket.close(); }
  }, [sessionId]);


  const onPlay = (time: number) => {
    console.log(`Emitting play at ${time}`);
    if (time === lastReceived.current.videoTime
      && Date.now() - lastReceived.current.timestamp < 200
      && lastReceived.current.action === 'play') {
      console.log("Ignoring previous.");
      return;
    }
    socket.emit("play", { sessionId, timestamp: time, videoUrl: url });
  }

  const onPause = (time: number) => {
    console.log(`Emitting pause at ${time}`);
    if (time === lastReceived.current.videoTime && Date.now() - lastReceived.current.timestamp < 200) {
      console.log("Ignoring previous.");
      return;
    }
    socket.emit("pause", { sessionId, timestamp: time, videoUrl: url });
  }

  const onEnd = () => {
    console.log("Emitting end event");
  }

  const requestState = () => {
    console.log("Requesting state");
    socket.emit("requestState", { sessionId })
  }

  const handleChangeVideoClose = (newUrl: string) => {
    setDialogOpen(false);
    console.log(`Changing URL to ${newUrl}`);
    const changedUrl = newUrl !== url;
    setUrl(newUrl);
    changedUrl && socket.emit("changeVideo", { sessionId, videoUrl: newUrl });
  }

  if (!!url) {
    return (
      <>
        <ChangeVideoDialog open={dialogOpen} onClose={handleChangeVideoClose} />
        <Box
          width="100%"
          maxWidth={1000}
          display="flex"
          gap={1}
          marginTop={1}
          alignItems="center"
        >
          {sessionName != null && <TextField
            label="Session Name"
            variant="filled"
            value={sessionName}
            inputProps={{
              readOnly: true,
              disabled: true,
            }}
            fullWidth
          />}
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-youtube-url" variant="outlined">Youtube URL</InputLabel>
            <OutlinedInput
              id="outlined-youtube-url"
              type='text'
              endAdornment={<IconButton onClick={() => setDialogOpen(true)}>
                <ChangeCircleIcon />
              </IconButton>}
              label="Youtube URL"
              value={url}
            />
          </FormControl>
          <Tooltip title={linkCopied ? "Link copied" : "Copy link to share"}>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              }}
              disabled={linkCopied}
              variant="contained"
              sx={{ whiteSpace: "nowrap", minWidth: "max-content" }}
            >
              <LinkIcon />
            </Button>
          </Tooltip>
          <Tooltip title={`${members} in session.`}>
            <Button
              disabled={false}
              variant="contained"
              sx={{ whiteSpace: "nowrap", minWidth: "max-content" }}
            >
              {members}
              <PersonIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Create new watch party">
            <Button
              onClick={() => {
                navigate("/create");
              }}
              variant="contained"
              sx={{ whiteSpace: "nowrap", minWidth: "max-content" }}
            >
              <AddCircleOutlineIcon />
            </Button>
          </Tooltip>
        </Box>
        <VideoPlayer selfRef={player} url={url} onPlay={onPlay} onPause={onPause} onEnd={onEnd} requestState={requestState} />
      </>
    );
  }

  return null;
};

export default WatchSession;
