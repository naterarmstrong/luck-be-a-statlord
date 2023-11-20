import { Box, Button } from "@mui/material";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import ReactPlayer from "react-player";

export type VideoPlayerHandle = {
  playAt: (time: number) => void;
  pauseAt: (time: number) => void;
  isPlaying: () => boolean;
  getCurrentTime: () => number;
}

interface VideoPlayerProps {
  selfRef: React.MutableRefObject<VideoPlayerHandle | null>;
  url: string;
  hideControls?: boolean;
  onPlay: (time: number) => void;
  onPause: (time: number) => void;
  onEnd: () => void;
  requestState: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ selfRef, url, hideControls, onPlay, onPause, onEnd, requestState }) => {
  const [hasJoined, setHasJoined] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const player = useRef<ReactPlayer>(null);

  const handleReady = () => {
    console.log("Ready");
    setIsReady(true);
    requestState();
  };

  const handleEnd = () => {
    console.log("Video ended");
    onEnd();
  };

  const handlePlay = () => {
    console.log(
      "User played video at time: ",
      player.current!.getCurrentTime()
    );
    setPlaying(true);
    onPlay(player.current!.getCurrentTime());
  };

  const handlePause = () => {
    console.log(
      "User paused video at time: ",
      player.current!.getCurrentTime()
    );
    setPlaying(false);
    onPause(player.current!.getCurrentTime());
  };

  const handleBuffer = () => {
    console.log("Video buffered");
  };

  const handleProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    console.log("Video progress: ", state);
    // We only care about progress events if we are paused.
    // progress events get emitted when seeking while paused
    !playing && onPause(state.playedSeconds);
  };

  useImperativeHandle(selfRef, () => ({
    playAt(time: number) {
      console.log(`Playing at ${time}`);
      if (!player.current) {
        setPlaying(true);
        return;
      }
      if (time != player.current.getCurrentTime()) {
        player.current.seekTo(time, 'seconds');
      }
      setPlaying(true);
    },
    pauseAt(time: number) {
      console.log(`Pausing at ${time}`);
      if (!player.current) {
        setPlaying(false);
        return;
      }
      if (time != player.current.getCurrentTime()) {
        player.current.seekTo(time, 'seconds');
      }
      setPlaying(false);
    },
    isPlaying(): boolean {
      return playing;
    },
    getCurrentTime(): number {
      return player.current?.getCurrentTime() ?? 0;
    }
  }));

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box
        width="100%"
        height="100%"
        display={hasJoined ? "flex" : "none"}
        flexDirection="column"
      >
        <ReactPlayer
          ref={player}
          url={url}
          playing={hasJoined && playing}
          controls={!hideControls}
          onReady={handleReady}
          onEnded={handleEnd}
          onPlay={handlePlay}
          onPause={handlePause}
          onBuffer={handleBuffer}
          onProgress={handleProgress}
          width="100%"
          height="100%"
          style={{ pointerEvents: hideControls ? "none" : "auto" }}
        />
      </Box>
      {!hasJoined && isReady && (
        // Youtube doesn't allow autoplay unless you've interacted with the page already
        // So we make the user click "Join Session" button and then start playing the video immediately after
        // This is necessary so that when people join a session, they can seek to the same timestamp and start watching the video with everyone else
        <Button
          variant="contained"
          size="large"
          onClick={() => setHasJoined(true)}
        >
          Watch Session
        </Button>
      )}
    </Box>
  );
};

export default VideoPlayer;
