SELECT
    Items.name,
    Items.rarity,
    ROUND(100 * SUM(CASE WHEN Runs.victory = true THEN 1.0 ELSE 0.0 END) / SUM(COUNT(*)) over(PARTITION BY Items.name), 2) as win_rate,
    COUNT(*) as total_games
FROM
    Runs JOIN ItemDetails JOIN Items
WHERE
    Runs.id = ItemDetails.RunId
    AND ItemDetails.item = Items.name
    AND Runs.date > 1668507128001
    AND Items.rarity != 'essence'
GROUP BY
    Items.name;