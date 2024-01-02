import { Box, Divider, Link, Typography } from "@mui/material";
import SymImg from "../components/SymImg";
import { Symbol } from "../common/models/symbol";
import { Item } from "../common/models/item";

const FAQ: React.FC = () => {

    const dividerColor = "#aaaaaa"

    return <Box justifyContent="center" alignItems="center" display="flex">
        <Box justifyContent="start" display="flex" flexDirection="column" alignItems="center" minHeight="100vh" maxWidth="800px">
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
                Why does oyster have such a high winrate?
            </Typography>
            <Divider sx={{ border: () => `2px solid ${dividerColor}`, minWidth: "200px", marginBottom: "10px" }} />
            <Typography variant="body1" lineHeight={1}>
                Symbols like <SymImg tile={Symbol.Oyster} textAlign />oyster have very high winrates because they are usually only picked when the player has a strong synergy.
                For oyster, that synergy is with <SymImg tile={Symbol.Diver} textAlign />Diver.
                <br />
                On this <Link href="/symbolDetails?symbol=Oyster&secondarySymbol=Diver">page</Link>, you
                can see that oyster is only picked without diver in 2% of games, compared to being
                picked with diver in 10% of games. Oyster has a 59% winrate without diver, which
                is much more similar to what would be expected for a common symbol. This same principle applies to many other symbols,
                like the hexes with <SymImg tile={Symbol.EldritchCreature} textAlign />Eldritch Creature or<SymImg tile={Item.HolyWater} textAlign />Holy Water.
                <br /> <br />
                You can try to control for this by looking at the paired symbols with items in the symbol details pages.
            </Typography>
            <Typography variant="h3" lineHeight={1}>
                Known Issues
            </Typography>
            <Divider sx={{ border: () => `2px solid ${dividerColor}`, minWidth: "200px", marginBottom: "10px" }} />
            <Typography variant="body1" lineHeight={1}>
                - Arrows do not visually point the direction they are supposed to. <br />
                - Dice do not display their final roll in the post-effects view of a run. <br />
                - The rent payment is subtracted half from the pre-effect coins, half from the post-effect coins. <br />
                - Eaters (Geologist, Mrs. Fruit, etc) do not show their bonus pre-effects in run replays.
            </Typography>
        </Box></Box>;
}

export default FAQ;