SELECT
    Symbols.name,
    Symbols.rarity,
    ROUND(100 * SUM(CASE WHEN Runs.victory = true THEN 1.0 ELSE 0.0 END) / SUM(COUNT(*)) over(PARTITION BY Symbols.name), 2) as win_rate,
    SUM(CASE WHEN Runs.victory = true AND SymbolDetails.addedByChoice > 0 THEN 1.0 ELSE 0.0 END) as chosen_won_games,
    ROUND(CAST(SUM(SymbolDetails.count) as FLOAT) / SUM(COUNT(*)) over(PARTITION by Symbols.name), 2) as total_shows,
    COUNT(*) as total_games,
    SUM(CASE WHEN SymbolDetails.addedByChoice > 0 THEN 1 ELSE 0 END) as chosen_games
FROM
    Runs JOIN SymbolDetails JOIN Symbols
WHERE
    Runs.id = SymbolDetails.RunId
    AND SymbolDetails.symbol = Symbols.name
    AND Runs.date > 1668507128000
GROUP BY
    Symbols.name;