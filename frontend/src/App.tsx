import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import UploadRuns from "./routes/UploadRuns";

import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Login from "./routes/Login";
import userContext, { UserData } from "./contexts/UserContext";
import Cookies from "universal-cookie";
import Profile from "./routes/Profile";
import MainPage from "./routes/MainPage";
import TileDetails from "./routes/TileDetails";
import PurplePepperCalculator from "./routes/PurplePepperCalculator";
import CrabCalculator from "./routes/CrabCalculator";
import RunDisplay from "./routes/RunDisplay";
import ItemStats from "./routes/ItemStats";
import AllEssenceStats from "./components/AllEssenceStats";
import RunReplay from "./routes/RunReplay";
import Dictionary from "./routes/Dictionary";
import NotFound from "./routes/NotFound";
import About from "./routes/About";
import FAQ from "./routes/Faq";
import AllSymbolStats from "./components/AllSymbolStats";
import EaterCalculator from "./routes/EaterCalculator";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  // TODO: figure out how to make this nicer
  typography: {
    fontFamily: "SinsGold",
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
      <userContext.Provider value={{ setUser, ...user }}>
        <CssBaseline />
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/upload" element={<UploadRuns />} />
            <Route
              path="/symbolDetails"
              element={<TileDetails mode="symbol" />}
            />
            <Route path="/itemDetails" element={<TileDetails mode="item" />} />
            <Route
              path="/essenceDetails"
              element={<TileDetails mode="essence" />}
            />
            <Route path="/symbolStats" element={<AllSymbolStats />} />
            <Route path="/itemStats" element={<ItemStats />} />
            <Route path="/essenceStats" element={<AllEssenceStats />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/run/:runId" element={<RunReplay />} />
            <Route
              path="/user/:userId/run/:runNumber"
              element={<RunReplay />}
            />
            <Route
              path="/purplePepperCalculator"
              element={<PurplePepperCalculator />}
            />
            <Route path="/crabCalculator" element={<CrabCalculator />} />
            <Route path="/eaterCalculator" element={<EaterCalculator />} />
            <Route path="/runTest" element={<RunDisplay />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </userContext.Provider>
    </ThemeProvider>
  );
};

export default App;
