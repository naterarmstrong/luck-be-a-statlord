WITH UserWinrates as (
    SELECT
        UserId,
        COUNT(*) AS total_games,
        AVG(CAST(victory as REAL)) AS winrate
    FROM
        Runs
    WHERE
        Runs.date > 1668507128000
        AND Runs.isFloor20 = true
    GROUP BY
        UserId    
)
SELECT
    u.total_games AS total_games,
    SUM(CASE WHEN victory = true AND u.UserId = :userId THEN 1 ELSE 0 END) AS wins,
    SUM(CASE WHEN guillotine = true AND u.UserId = :userId THEN 1 ELSE 0 END) as guillotines,
    SUM(CASE WHEN spins > 5 AND u.UserId = :userId THEN 1 ELSE 0 END) as beat_rent_1_count,
    SUM(CASE WHEN spins > 10 AND u.UserId = :userId THEN 1 ELSE 0 END) as beat_rent_2_count,
    SUM(CASE WHEN spins > 16 AND u.UserId = :userId THEN 1 ELSE 0 END) as beat_rent_3_count,
    SUM(CASE WHEN spins > 22 AND u.UserId = :userId THEN 1 ELSE 0 END) as beat_rent_4_count,
    SUM(CASE WHEN spins > 29 AND u.UserId = :userId THEN 1 ELSE 0 END) as beat_rent_5_count,
    SUM(CASE WHEN spins > 36 AND u.UserId = :userId THEN 1 ELSE 0 END) as beat_rent_6_count,
    SUM(CASE WHEN spins > 44 AND u.UserId = :userId THEN 1 ELSE 0 END) as beat_rent_7_count,
    SUM(CASE WHEN spins > 52 AND u.UserId = :userId THEN 1 ELSE 0 END) as beat_rent_8_count,
    SUM(CASE WHEN spins > 61 AND u.UserId = :userId THEN 1 ELSE 0 END) as beat_rent_9_count,
    SUM(CASE WHEN spins > 70 AND u.UserId = :userId THEN 1 ELSE 0 END) as beat_rent_10_count,
    SUM(CASE WHEN spins > 80 AND u.UserId = :userId THEN 1 ELSE 0 END) as beat_rent_11_count,
    SUM(CASE WHEN spins > 90 AND u.UserId = :userId THEN 1 ELSE 0 END) as beat_rent_12_count,
    SUM(CASE WHEN spins > 100 AND u.UserId = :userId THEN 1 ELSE 0 END) as beat_rent_13_count,
    (SELECT COUNT(*) FROM UserWinrates where winrate > u.winrate AND total_games > 30) as higher_winrate_players,
    (SELECT COUNT(*) FROM UserWinrates where total_games > u.total_games) as higher_game_players,
    (SELECT COUNT(*) FROM UserWinrates) as total_players
FROM
    Runs join UserWinrates as u
WHERE
    Runs.UserId = :userId
    AND Runs.date > 1668507128000
    AND Runs.isFloor20 = true
    AND u.UserId = :userId;