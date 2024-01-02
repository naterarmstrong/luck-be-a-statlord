SELECT
    Items.name,
    Items.rarity,
    ROUND(100 * SUM(CASE WHEN Runs.victory = true THEN 1.0 ELSE 0.0 END) / SUM(COUNT(*)) over(PARTITION BY Items.name), 2) as win_rate,
    SUM(CASE WHEN Runs.victory = true AND ItemDetails.addedByChoice > 0 THEN 1.0 ELSE 0.0 END) as chosen_won_games,
    COUNT(*) as total_games,
    SUM(CASE WHEN ItemDetails.addedByChoice > 0 THEN 1 ELSE 0 END) as chosen_games
FROM
    Runs JOIN ItemDetails JOIN Items
WHERE
    Runs.id = ItemDetails.RunId
    AND ItemDetails.item = Items.name
    AND Runs.date > 1668507128001
    AND Items.rarity != 'essence'
    AND Runs.isFloor20 = true
GROUP BY
    Items.name;