# Luck Be a Statlord

Luck be a statlord is a fan website for the game Luck be a Landlord. It's focused on collecting game stats, and making replays semi-functional based on parsed run logs. The website's styling is heavily inspired by the game, and follows it where possible.

## Tour

This is a series of screenshots to show off the website functionality.

### Main Page

The main page contains several cards populated with interesting peeks at stats from various areas of the site.

![title page](/img/main-page.png)
![second row](/img/second-row-main-page.png)
![third row](/img/third-row-main-page.png)
![last row and footer](/img/final-row-footer-main-page.png)

### Logging in and Uploading

After logging in, which is only password-based, you can upload runs with the upload button. It will show how many runs you are uploading, and then begin processing with a progress bar. Afterwards, it shows the runs processed.
![uploading runs](/img/uploading-runs.png)
![processing-runs](/img/processing-runs.png)
![displaying runs](/img/displaying-uploaded-runs.png)

### Viewing Runs

When viewing runs, there is a main page where you can go through the run spin-by-spin to see a replay, and also graphs summarizing the run beneath it.

![mid run screenshot](/img/mid-run-screenshot.png)
![showing coins](/img/coin-run-screenshot.png)

#### A Successful Run

![normal graph 1](/img/normal-coins-per-spin.png)
![normal graph 2](/img/normal-coin-total.png)
![normal graph 2](/img/normal-cumulative-coins.png)

#### A Wildly Successful Run

![runaway graph 1](/img/runaway-coins-per-spin.png)
![runaway graph 2](/img/runaway-coin-total.png)
![runaway graph 2](/img/runaway-cumulative-coins.png)

#### A Failed Run

![failed graph 1](/img/failed-run.png)

### Viewing Statistics

The game consists of symbols, items, and essences. There are aggregate statistics for each, and they can also be compared pairwise to see how they impact winrates.

![symbol stats](/img/symbol-stats-page.png)
![sorted symbol stats](/img/sorted-filtered-symbols.png)
![essence stats](/img/essence-rate.png)
![symbol details](/img/symbol-detail-page.png)

### Profile Pages

The profile page contains aggregate metrics about a player's performance. This only considers the hardest game difficultly, referred to as floor 20.

![profile page](/img/profile-page.png)
![profile card closeup](/img/profile-card-closeup.png)
![winrate details](/img/winrate-details.png)
![recent runs](/img/recent-runs.png)

### Miscellaneous Tools

The website also contains some small tools to help people calculate relevant stats in the game.

![tools dropdown](/img/tools-window.png)
![purple pepper calculator](/img/purple-pepper-calculator.png)
![symbol dictionary](/img/dictionary-page.png)

## Running the Website

After installing all dependencies, start up the front and backend by running `npm start` the `frontend` and `npm start dev` `backend` folder to start in dev mode.

## Parsing Effects

Luck be a Landlord logs create a variety of effects that are necessary to parse in order to construct a history of the game. They start with the symbol or item being parsed, then the comparisons that took place, the `giver` and `target`, and the `value_to_change`. The `value_to_change` is a deceptively simple name for the variety of meanings it encompasses.

Symbols can be added as a consequence of effects, which can be determined because the `Added symbols` is between the effects, instead of after the coin total.

An example effect is below:

```
[12/7/2023 19:21:55] Effect - milk (x:2, y:0): {comparisons:[{a:indestructible, b:False, not_prev:True}, {a:type, b:milk, not_prev:True}], diff:True, giver:cat, item_to_destroy:pizza_the_cat_essence, value_to_change:destroyed}

```

Call the initial symbol (in this case, `milk`) the `primary` symbol.

### `value_to_change`

Here are some of the values, and what they mean:

- `type`: This means that the `primary` symbol has been _transformed_ into the current `primary` symbol. In order to determine the previous symbol at that location, it is necessary to check what was at the location of the effect, or look at the first comparison of the effect. The new value can be seen by the `primary`, or by the `diff`, which will contain the new symbol.
- `destroyed`: This means that the `primary` symbol will be destroyed.
- `removed`: This means that the `primary` symbol will be removed.
- `value_bonus`: If there is a `target` symbol, it is an additive increase to the coins given by the `target`. Otherwise, it is an additive increase to the coins given by the `primary`.
- `achievement_value`: This is only used for steam achievements.
- `value_multiplier`: If there is a `target` symbol, it is a multiplicative increase to the coins given by the `target`. Otherwise, it is a multiplicative increase to the coins given by the `primary`.
- `pointing_directions`: This is used for arrows to change their orientation.
- `value`: This is almost always set by the `primary` for items that have variable values. For example, fish bowl, the peppers, and the egg carton.
- `times_displayed`: This sets the number of times that a symbol has been displayed, which is tracked internally. This is used for both symbols that destroy themselves like Duds, and symbols that periodically give coins like the sloth. Those symbols will set their `times_displayed` to 0 every time they give coins, which ticks up every time it shows up without appearing as an effect.
- `saved_value`: This is used by items that trigger periodically, as well as essences that need to wait a certain number of spins.
- `permanent_bonus`: This is used for eaters (Ms. Fruit, Diver, etc) and symbols that grow in value (Amethyst, Pear) to permanently increase their value. The amount it increases by can be determined from the `diff`.
- `permanent_bonuses`: This is used for essences, and permanently changes things for a subset of symbols. An example of a permanent bonus triggering is below. The `diff` describes what the bonus is, and what symbols it applies to.
- `wildcarded`: This is used when a symbol acts as a wildcard. Once a symbol has `wildcarded` set to true, it is evaluated as a wildcard in later value calculations. Wildcards are evaluated last.

```
[12/7/2023 19:27:14] Effect - ricky_the_banana_essence: {comparisons:[{a:symbol_trigger, b:True}], diff:True, value_to_change:destroyed}
[12/7/2023 19:27:14] Effect - ricky_the_banana_essence: {add_to_array:True, comparisons:[{a:destroyed, b:True}], diff:{bonus:2, type:banana}, value_to_change:permanent_bonuses}
[12/7/2023 19:27:14] Effect - ricky_the_banana_essence: {add_to_array:True, comparisons:[{a:destroyed, b:True}], diff:{bonus:2, type:banana_peel}, value_to_change:permanent_bonuses}
```

## Missing Information

There are a few things that are impossible to determine from run logs alone.

- Offered symbols and items.
  - It is impossible to determine which symbols and items were offered to the player based on the run log. It only states which symbols and items were added, if any.
- Symbols removed via removal tokens
  - These symbols can be _inferred_ to disappear, as they will appear less frequently if there are multiple copies, or not at all if the last copy is removed. However, you cannot be sure that they are removed unless an empty is rolled, at which point you know for certain which symbols still exist.
- Reroll and removal tokens
  - When added via the capsules, these are noted in the run logs. However, spending them is not visible.

## Handling Mods

All modded symbols (and existing symbols that are changed by a mod) will have the steamId appended to their id as it appears in the logs. By rejecting runs that have unknown symbols and items, we can avoid importing modded runs.
