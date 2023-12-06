SELECT
    Symbols.name,
    Symbols.rarity,
    ROUND(100 * SUM(CASE WHEN Runs.victory = true THEN 1.0 ELSE 0.0 END) / SUM(COUNT(*)) over(PARTITION BY Symbols.name), 2) as win_rate,
    ROUND(CAST(SUM(SymbolDetails.count) as FLOAT) / SUM(COUNT(*)) over(PARTITION by Symbols.name), 2) as total_shows,
    COUNT(*) as total_games
FROM
    Runs JOIN SymbolDetails JOIN Symbols
WHERE
    Runs.id = SymbolDetails.RunId
    AND SymbolDetails.symbol = Symbols.name
GROUP BY
    Symbols.name;