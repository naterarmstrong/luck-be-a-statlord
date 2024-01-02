import { Box, Divider, Link, Typography } from "@mui/material";

const FAQ: React.FC = () => {

    const dividerColor = "#aaaaaa"

    return <Box justifyContent="start" display="flex" flexDirection="column" alignItems="center" minHeight="100vh">
        <Typography variant="h1">
            FAQ
        </Typography>
        <Typography variant="h3" lineHeight={1} maxWidth={1000}>
            Why can't I see my full guillotine run?
        </Typography>
        <Divider sx={{ border: () => `2px solid ${dividerColor}`, minWidth: "200px", marginBottom: "10px" }} />
        <Typography variant="body1" lineHeight={1} maxWidth={1000}>
            This website is primarily designed to track competitive-style statistics. The run's
            information past the spin where the landlord is defeated takes up a lot of space. To
            that end, we track every spin until you beat the landlord, and then the final spin
            before the run ends.
        </Typography>
        <Typography variant="h3" lineHeight={1}>
            Known Issues
        </Typography>
        <Divider sx={{ border: () => `2px solid ${dividerColor}`, minWidth: "200px", marginBottom: "10px" }} />
        <Typography variant="body1" lineHeight={1}>
            - Arrows do not visually point the direction they are supposed to. <br />
            - Dice do not display their final roll in the post-effects view of a run. <br />
            - The rent payment is subtracted half from the pre-effect coins, half from the post-effect coins. <br />
        </Typography>
    </Box>;
}

export default FAQ;