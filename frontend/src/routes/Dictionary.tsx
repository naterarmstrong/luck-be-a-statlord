import { Box, Grid, Link, Typography } from "@mui/material";
import { ITEM_RARITIES, Item, itemToDisplay } from "../common/models/item";
import { Symbol } from "../common/models/symbol";
import { Token } from "../common/models/token";
import SymImg from "../components/SymImg";
import { Rarity } from "../common/models/rarity";

const Dictionary: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "#4a0a2b" }}>
      <Typography variant="h2">Dictionary</Typography>
      <Typography variant="h3">Symbols</Typography>
      <Grid container>
        {Object.keys(Symbol).map((s) => (
          <Grid item key={s}>
            <Link href={`/symbolDetails?symbol=${s}`}>
              <SymImg
                tile={s as Symbol}
                size={120}
                style={{ marginLeft: "30px", marginRight: "30px" }}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
      <Box width="100%" sx={{ backgroundColor: "#0a4542" }}>
        <Typography variant="h3">Items</Typography>
        <Grid container>
          {Object.keys(Item)
            .filter((i) => ITEM_RARITIES[i as Item] !== Rarity.Essence)
            .sort((a, b) =>
              itemToDisplay(a as Item) < itemToDisplay(b as Item) ? -1 : 1,
            )
            .map((i) => (
              <Grid item key={i}>
                <Link href={`/itemDetails?item=${i}`}>
                  <SymImg
                    tile={i as Item}
                    size={120}
                    style={{ marginLeft: "30px", marginRight: "30px" }}
                  />
                </Link>
              </Grid>
            ))}
        </Grid>
      </Box>
      <Typography variant="h3">Essences</Typography>
      <Grid container>
        {Object.keys(Item)
          .filter((i) => ITEM_RARITIES[i as Item] === Rarity.Essence)
          .sort((a, b) =>
            itemToDisplay(a as Item) < itemToDisplay(b as Item) ? -1 : 1,
          )
          .map((e) => (
            <Grid item key={e}>
              <Link href={`/essenceDetails?essence=${e}`}>
                <SymImg
                  tile={e as Item}
                  size={120}
                  style={{ marginLeft: "30px", marginRight: "30px" }}
                />
              </Link>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Dictionary;
