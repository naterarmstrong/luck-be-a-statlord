import { Autocomplete, Box, TextField } from "@mui/material";
import { Rarity, rarityColor } from "../common/models/rarity";
import { ITEM_RARITIES, Item, isItem } from "../common/models/item";
import { ITEM_TO_IMG } from "../utils/item";

interface ItemSelectorProps {
  item: Item;
  setItem: (s: Item) => void;
  essence?: boolean;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
  item,
  setItem,
  essence,
}) => {
  return (
    <Autocomplete
      disablePortal
      autoComplete
      disableClearable
      options={Object.keys(Item).filter((i) =>
        essence
          ? ITEM_RARITIES[i as Item] === Rarity.Essence
          : ITEM_RARITIES[i as Item] !== Rarity.Essence,
      )}
      value={item}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{
            "& > img": { mr: 2, flexShrink: 0 },
            color: rarityColor(ITEM_RARITIES[option as Item]),
          }}
          {...props}
        >
          <Box
            component="img"
            style={{ width: "40px" }}
            src={ITEM_TO_IMG.get(option as Item)}
          />
          {option}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <Box
                component="img"
                style={{ width: "40px" }}
                src={ITEM_TO_IMG.get(item)}
              />
            ),
          }}
          onChange={(e) => {
            isItem(e.target.value) && setItem(e.target.value as Item);
          }}
        />
      )}
      onChange={(event, value) => {
        value && isItem(value) && setItem(value as Item);
      }}
    />
  );
};

export default ItemSelector;
