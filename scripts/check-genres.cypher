// Script pour vérifier les genres disponibles dans Neo4j
// Usage: Copier-coller dans Neo4j Browser (http://localhost:7474)

// 1. Lister tous les genres uniques dans la base
MATCH (m:Movie)
UNWIND m.genres AS genre
RETURN DISTINCT genre
ORDER BY genre;

// 2. Compter les films par genre
MATCH (m:Movie)
UNWIND m.genres AS genre
RETURN genre, count(m) as movie_count
ORDER BY movie_count DESC, genre;

// 3. Vérifier les films avec leurs genres
MATCH (m:Movie)
WHERE m.genres IS NOT NULL AND size(m.genres) > 0
RETURN m.title, m.genres, m.average_rating
ORDER BY m.average_rating DESC
LIMIT 30;

// 4. Chercher les variations de noms de genres
MATCH (m:Movie)
UNWIND m.genres AS genre
WITH toLower(genre) as lower_genre, collect(DISTINCT genre) as variants
WHERE size(variants) > 1
RETURN lower_genre, variants;

// 5. Films sans genres
MATCH (m:Movie)
WHERE m.genres IS NULL OR size(m.genres) = 0
RETURN count(m) as movies_without_genres;
