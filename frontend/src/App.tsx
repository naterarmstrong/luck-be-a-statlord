import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import WatchSession from "./routes/WatchSession";
import CreateSession from "./routes/CreateSession";
import UploadRuns from "./routes/UploadRuns";

import React from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  // TODO: figure out how to make this nicer
  typography: {
    fontFamily: 'SinsGold',
    fontSize: 30,
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        <Routes>
          <Route path="/" element={<CreateSession />} />
          <Route path="/create" element={<CreateSession />} />
          <Route path="/upload" element={<UploadRuns />} />
          <Route path="/watch/:sessionId" element={<WatchSession />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

export default App;
