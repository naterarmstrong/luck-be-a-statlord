import { Box } from "@mui/material";
import Footer from "./Footer";
import Header from "./Header";
import { SnackbarProvider } from "notistack";

const Layout: React.FC = (props) => {
  return (
    <SnackbarProvider maxSnack={4}>
      <Header />
      <Box minHeight="100vh">{props.children}</Box>
      <Footer />
    </SnackbarProvider>
  );
};

export default Layout;
