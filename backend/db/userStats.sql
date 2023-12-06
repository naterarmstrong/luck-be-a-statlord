SELECT
    COUNT(*) AS total_games,
    SUM(CASE WHEN victory = true THEN 1 ELSE 0 END) AS wins,
    SUM(CASE WHEN guillotine = true THEN 1 ELSE 0 END) as guillotines,
    SUM(CASE WHEN spins > 5 THEN 1 ELSE 0 END) as beat_rent_1_count,
    SUM(CASE WHEN spins > 10 THEN 1 ELSE 0 END) as beat_rent_2_count,
    SUM(CASE WHEN spins > 16 THEN 1 ELSE 0 END) as beat_rent_3_count,
    SUM(CASE WHEN spins > 22 THEN 1 ELSE 0 END) as beat_rent_4_count,
    SUM(CASE WHEN spins > 29 THEN 1 ELSE 0 END) as beat_rent_5_count,
    SUM(CASE WHEN spins > 36 THEN 1 ELSE 0 END) as beat_rent_6_count,
    SUM(CASE WHEN spins > 44 THEN 1 ELSE 0 END) as beat_rent_7_count,
    SUM(CASE WHEN spins > 52 THEN 1 ELSE 0 END) as beat_rent_8_count,
    SUM(CASE WHEN spins > 61 THEN 1 ELSE 0 END) as beat_rent_9_count,
    SUM(CASE WHEN spins > 70 THEN 1 ELSE 0 END) as beat_rent_10_count,
    SUM(CASE WHEN spins > 80 THEN 1 ELSE 0 END) as beat_rent_11_count,
    SUM(CASE WHEN spins > 90 THEN 1 ELSE 0 END) as beat_rent_12_count,
    SUM(CASE WHEN spins > 100 THEN 1 ELSE 0 END) as beat_rent_13_count
FROM
    Runs
WHERE
    Runs.UserId = :userId;