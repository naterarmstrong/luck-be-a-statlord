SELECT
			ROUND(100 * SUM(CASE WHEN Runs.victory = true THEN 1.0 ELSE 0.0 END) / SUM(COUNT(*)) over(), 2) as win_rate,
			ROUND(CAST(SUM(s1.count) as FLOAT) / SUM(COUNT(*)) over(), 2) as total_shows,
			COUNT(*) as total_games
	FROM
			Runs
			JOIN SymbolDetails AS s1
	WHERE
			Runs.id = s1.RunId
			AND s1.symbol = :symbol1
			AND Runs.date > 1668507128000
			AND EXISTS (
				SELECT 1 FROM SymbolDetails as s2 WHERE s2.RunId = Runs.id AND s2.symbol = :symbol2
			);