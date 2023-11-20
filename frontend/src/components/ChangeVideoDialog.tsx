import { Button, Dialog, DialogTitle, Grid, TextField } from "@mui/material";
import { KeyboardEventHandler, useState } from "react";
import YoutubePreview from "./YoutubePreview";


export interface ChangeVideoDialogProps {
    open: boolean;
    onClose: (newUrl: string) => void;
}

const ChangeVideoDialog: React.FC<ChangeVideoDialogProps> = ({ open, onClose }) => {
    const [newUrl, setNewUrl] = useState("");
    const [videoId, setVideoId] = useState("");

    const handleClose = () => {
        onClose(newUrl);
    }

    const handleUrlChange = (newUrl: string) => {
        const videoId = extractVideoID(newUrl);
        setVideoId(videoId)
    };

    const handleKeyDown: KeyboardEventHandler = (e) => {
        if (e.key === 'Enter') {
            onClose(newUrl);
        }
    }

    // Video ID extraction regex from [here](https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url)
    const extractVideoID = (url: string) => {
        // TODO: Handle case where the youtube part of the URL is missing as well. This does not catch all malformed IDs
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match.length >= 7 && match[7].length === 11) ? match[7] : "";
    };

    return (
        <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
            <DialogTitle>Choose the new video title</DialogTitle>
            <Grid container>
                <Grid item style={{ paddingLeft: 0, paddingRight: 0, flexGrow: 1 }}>
                    <TextField
                        label="Youtube URL"
                        variant="outlined"
                        value={newUrl}
                        onChange={(e) => { setNewUrl(e.target.value); handleUrlChange(e.target.value); }}
                        onKeyDown={handleKeyDown}
                        fullWidth
                    />
                </Grid>
                <Grid item alignItems="stretch" style={{ display: "flex" }}>
                    <Button
                        disabled={newUrl === ""}
                        onClick={() => onClose(newUrl)}
                        size="small"
                        variant="contained"
                    >
                        Change
                    </Button>
                </Grid>
            </Grid>
            {newUrl !== "" && <YoutubePreview videoId={videoId} />}
        </Dialog>
    )
}

export default ChangeVideoDialog;