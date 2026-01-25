// Script pour vérifier les trailers dans Neo4j
// Usage: Copier-coller dans Neo4j Browser (http://localhost:7474)

// 1. Statistiques globales des trailers
MATCH (m:Movie)
RETURN
  count(m) as total_movies,
  count(m.trailer_url) as movies_with_trailer_property,
  size([x IN collect(m.trailer_url) WHERE x IS NOT NULL AND x <> '']) as movies_with_valid_trailer,
  size([x IN collect(m.trailer_url) WHERE x IS NULL OR x = '']) as movies_without_trailer;

// 2. Films avec trailers par genre
MATCH (m:Movie)
WHERE m.trailer_url IS NOT NULL AND m.trailer_url <> ''
UNWIND m.genres AS genre
RETURN genre, count(m) as movies_with_trailers
ORDER BY movies_with_trailers DESC;

// 3. Films Sci-Fi avec/sans trailers
MATCH (m:Movie)
WHERE any(g IN m.genres WHERE g IN ['Sci-Fi', 'Science Fiction', 'SciFi', 'Science-Fiction'])
RETURN
  'Sci-Fi' as category,
  count(m) as total,
  size([x IN collect(m) WHERE x.trailer_url IS NOT NULL AND x.trailer_url <> '']) as with_trailer,
  size([x IN collect(m) WHERE x.trailer_url IS NULL OR x.trailer_url = '']) as without_trailer;

// 4. Top Rated (rating >= 7) avec/sans trailers
MATCH (m:Movie)
WHERE m.average_rating IS NOT NULL AND m.average_rating >= 7.0
RETURN
  'Top Rated (>=7)' as category,
  count(m) as total,
  size([x IN collect(m) WHERE x.trailer_url IS NOT NULL AND x.trailer_url <> '']) as with_trailer,
  size([x IN collect(m) WHERE x.trailer_url IS NULL OR x.trailer_url = '']) as without_trailer;

// 5. Tous les Top Rated (tous ratings) avec/sans trailers
MATCH (m:Movie)
WHERE m.average_rating IS NOT NULL
WITH m ORDER BY m.average_rating DESC LIMIT 20
RETURN
  'Top 20 by Rating' as category,
  count(m) as total,
  size([x IN collect(m) WHERE x.trailer_url IS NOT NULL AND x.trailer_url <> '']) as with_trailer,
  size([x IN collect(m) WHERE x.trailer_url IS NULL OR x.trailer_url = '']) as without_trailer;

// 6. Liste des films Top Rated sans trailer
MATCH (m:Movie)
WHERE m.average_rating IS NOT NULL
  AND (m.trailer_url IS NULL OR m.trailer_url = '')
RETURN m.title, m.average_rating, m.genres
ORDER BY m.average_rating DESC
LIMIT 10;

// 7. Liste des films Sci-Fi sans trailer
MATCH (m:Movie)
WHERE any(g IN m.genres WHERE g IN ['Sci-Fi', 'Science Fiction', 'SciFi', 'Science-Fiction'])
  AND (m.trailer_url IS NULL OR m.trailer_url = '')
RETURN m.title, m.genres, m.average_rating
ORDER BY m.average_rating DESC NULLS LAST
LIMIT 10;

// 8. Ajouter des trailers aux films Top Rated qui n'en ont pas (EXEMPLE - À ADAPTER)
// ATTENTION: N'exécute cette requête qu'après avoir vérifié les films ci-dessus!
// MATCH (m:Movie)
// WHERE m.average_rating >= 7.0
//   AND (m.trailer_url IS NULL OR m.trailer_url = '')
//   AND m.title = 'NOM_DU_FILM'  // REMPLACER PAR LE VRAI NOM
// SET m.trailer_url = 'https://www.youtube.com/embed/VIDEO_ID'  // REMPLACER PAR LE VRAI ID
// RETURN m.title, m.trailer_url;

// 9. Ajouter un trailer par défaut à TOUS les films sans trailer (FALLBACK)
// ATTENTION: Cette requête va écraser les valeurs NULL!
// MATCH (m:Movie)
// WHERE m.trailer_url IS NULL OR m.trailer_url = ''
// SET m.trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
// RETURN count(m) as updated_count;
