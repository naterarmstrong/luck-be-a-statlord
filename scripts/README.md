# Script Usage

These scripts are designed to scrape information from the game, and used to generate code files that can then be fine-tuned by hand.

They are designed to run against files contained in a decompiled version of the game.

## Getting the game files

I won't provide instructions on how exactly to decompile the game, but it is reasonably standard to do so for godot.

The `Luck be a Landlord.pck` file, once decompiled, has the following file structure that is relevant to us.

```
res
  JSON
    Symbols - JSON.json
    Items - JSON.json
    Essences - JSON.json
    ...
  icons
    adoption_papers.png
    adoption_papers.png.import
    adoption_papers_essence.png
    adoption_papers_essence.png.import
    amethyst.png
    amethyst.png.import
    ...
  ...
```

Each of the files under the JSON has a similar structure.

### `Symbols` JSON

This JSON is an object of each symbol. The symbols are structured like below:

```json
  "amethyst": {
    "value": "1",
    "values": [
      1
    ],
    "rarity": "rare",
    "groups": [
      "gem",
      "scaler"
    ],
    "sfx": []
  },
```

Each symbol has its name as the key in the object.

- `value`: This is the base value the symbol gives when it appears on the board.
- `values`: This has a different meaning for every symbol, and is a list of the different numbers that appear, in order, in the description/ability of the symbol. In the case of Amethyst, it is the value by which the symbol's permanent value increases.
- `rarity`: This is the rarity field. The only interesting thing here is that the special symbols of `dud` and `empty` have a `null` value for this field. Additionally, `dice1` to `dice5` also have a null field, as they only appear in the symbols after roll, and are never in your inventory.
- `groups`: The game internally sorts symbols and (somewhat) items into groups, and uses them for other items to refer to. So `dame` would refer to `gems` for the symbols it buffs.
- `sfx`: This is the sound effect played after the symbols enters the field.

### `Items` and `Essences` JSON

Items is the same as the symbols JSON, except with only the `values`, `rarity`, and `groups`. The only `group` that is used is `pepper`.

Essences follows the same schema, except every one is in the `essence` group and has rarity `essence`.
