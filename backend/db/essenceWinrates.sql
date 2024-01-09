SELECT
    Items.name,
    Items.rarity,
    ROUND(100 * SUM(CASE WHEN Runs.victory = true THEN 1.0 ELSE 0.0 END) / SUM(COUNT(*)) over(PARTITION BY Items.name), 2) as win_rate,
    SUM(CASE WHEN Runs.victory = true AND ItemDetails.timesDestroyed > 0 THEN 1.0 ELSE 0.0 END) as destroyed_won_games,
    SUM(CASE WHEN ItemDetails.timesDestroyed > 0 THEN 1.0 ELSE 0.0 END) as total_destroyed_games,
    COUNT(*) as total_games,
    COUNT(*) as chosen_games,
    SUM(CASE WHEN Runs.victory = true THEN 1.0 ELSE 0.0 END) as chosen_won_games
FROM
    Runs JOIN ItemDetails JOIN Items
WHERE
    Runs.id = ItemDetails.RunId
    AND ItemDetails.item = Items.name
    AND Runs.date > 1668507128001
    AND Items.rarity = 'essence'
    AND Runs.isFloor20 = true
GROUP BY
    Items.name;