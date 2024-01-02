SELECT
    Users.id,
    Users.username,
    COUNT(*) as total_games,
    ROUND(100 * SUM(CASE WHEN Runs.victory = true THEN 1.0 ELSE 0.0 END) / SUM(COUNT(*)) over(PARTITION BY Users.id), 2) as win_rate
FROM
    Users JOIN Runs
WHERE
    Users.id = Runs.UserId
    AND Runs.isFloor20 = true
    AND Runs.date > 1668507128000
GROUP BY
    Users.id
HAVING
    total_games > :minGames
ORDER BY
    win_rate DESC
LIMIT
    :userCount;