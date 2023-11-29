import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import WatchSession from "./routes/WatchSession";
import CreateSession from "./routes/CreateSession";
import UploadRuns from "./routes/UploadRuns";

import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Login from "./routes/Login";
import userContext, { UserData } from "./contexts/UserContext";
import Cookies from "universal-cookie";
import Profile from "./routes/Profile";

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

const App: React.FC = () => {
  const [user, setUser] = useState<UserData>({ loggedIn: false });

  useEffect(() => {
    // Extract login state with cookie by loading at app startup
    // TODO: handle expiration
    const cookies = new Cookies();
    const username = cookies.get("username");
    const userId = cookies.get("userId");

    if (username) {
      setUser({ loggedIn: true, username: username, userId: userId });
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <userContext.Provider value={{ setUser, ...user }} >
        <CssBaseline />
        <Layout>
          <Routes>
            <Route path="/" element={<CreateSession />} />
            <Route path="/create" element={<CreateSession />} />
            <Route path="/upload" element={<UploadRuns />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/watch/:sessionId" element={<WatchSession />} />
          </Routes>
        </Layout>
      </userContext.Provider>
    </ThemeProvider >
  );
}

export default App;
