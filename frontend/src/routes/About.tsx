import { Box, Link, Typography } from "@mui/material";

const About: React.FC = () => {
  return (
    <Box
      justifyContent="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
    >
      <Typography variant="h2">About</Typography>
      <Typography variant="body1" maxWidth={400} lineHeight={1}>
        Luck be a Statlord is a fan website for the game Luck be a Landlord to
        calculate statistics about the various symbols and items in the game,
        and to display replays and personal winrates. It is entirely open
        source, and the source code can be found{" "}
        <Link href="https://github.com/naterarmstrong/luck-be-a-statlord">
          here
        </Link>
        . All art and intellectual property around the game belong to
        TrampolineTales.
      </Typography>
    </Box>
  );
};

export default About;
