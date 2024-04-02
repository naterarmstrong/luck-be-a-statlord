import { Box, Typography } from "@mui/material";

const NotFound: React.FC = () => {
  return (
    <Box>
      <Typography variant="h1"> 404 </Typography>
      <Typography variant="h2">
        {" "}
        Your landlord is in another castle!{" "}
      </Typography>
    </Box>
  );
};

export default NotFound;
