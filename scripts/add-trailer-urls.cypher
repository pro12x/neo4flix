// Script Cypher pour ajouter des URLs de bandes-annonces YouTube aux films
// À exécuter dans Neo4j Browser ou via l'API Neo4j

// The Matrix (1999)
MATCH (m:Movie {title: "The Matrix"})
SET m.trailer_url = "https://www.youtube.com/embed/vKQi3bBA1y8"
RETURN m.title, m.trailer_url;

// Inception (2010)
MATCH (m:Movie {title: "Inception"})
SET m.trailer_url = "https://www.youtube.com/embed/YoHD9XEInc0"
RETURN m.title, m.trailer_url;

// The Dark Knight (2008)
MATCH (m:Movie {title: "The Dark Knight"})
SET m.trailer_url = "https://www.youtube.com/embed/EXeTwQWrcwY"
RETURN m.title, m.trailer_url;

// Interstellar (2014)
MATCH (m:Movie {title: "Interstellar"})
SET m.trailer_url = "https://www.youtube.com/embed/zSWdZVtXT7E"
RETURN m.title, m.trailer_url;

// The Shawshank Redemption (1994)
MATCH (m:Movie {title: "The Shawshank Redemption"})
SET m.trailer_url = "https://www.youtube.com/embed/6hB3S9bIaco"
RETURN m.title, m.trailer_url;

// Pulp Fiction (1994)
MATCH (m:Movie {title: "Pulp Fiction"})
SET m.trailer_url = "https://www.youtube.com/embed/s7EdQ4FqbhY"
RETURN m.title, m.trailer_url;

// Fight Club (1999)
MATCH (m:Movie {title: "Fight Club"})
SET m.trailer_url = "https://www.youtube.com/embed/BdJKm16Co6M"
RETURN m.title, m.trailer_url;

// The Godfather (1972)
MATCH (m:Movie {title: "The Godfather"})
SET m.trailer_url = "https://www.youtube.com/embed/sY1S34973zA"
RETURN m.title, m.trailer_url;

// Forrest Gump (1994)
MATCH (m:Movie {title: "Forrest Gump"})
SET m.trailer_url = "https://www.youtube.com/embed/bLvqoHBptjg"
RETURN m.title, m.trailer_url;

// The Lord of the Rings: The Fellowship of the Ring (2001)
MATCH (m:Movie {title: "The Lord of the Rings: The Fellowship of the Ring"})
SET m.trailer_url = "https://www.youtube.com/embed/V75dMMIW2B4"
RETURN m.title, m.trailer_url;

// Star Wars: Episode IV - A New Hope (1977)
MATCH (m:Movie {title: "Star Wars"})
SET m.trailer_url = "https://www.youtube.com/embed/vZ734NWnAHA"
RETURN m.title, m.trailer_url;

// Avatar (2009)
MATCH (m:Movie {title: "Avatar"})
SET m.trailer_url = "https://www.youtube.com/embed/5PSNL1qE6VY"
RETURN m.title, m.trailer_url;

// Titanic (1997)
MATCH (m:Movie {title: "Titanic"})
SET m.trailer_url = "https://www.youtube.com/embed/kVrqfYjkTdQ"
RETURN m.title, m.trailer_url;

// Gladiator (2000)
MATCH (m:Movie {title: "Gladiator"})
SET m.trailer_url = "https://www.youtube.com/embed/uvbavW31adA"
RETURN m.title, m.trailer_url;

// The Avengers (2012)
MATCH (m:Movie {title: "The Avengers"})
SET m.trailer_url = "https://www.youtube.com/embed/eOrNdBpGMv8"
RETURN m.title, m.trailer_url;

// Spider-Man: No Way Home (2021)
MATCH (m:Movie {title: "Spider-Man: No Way Home"})
SET m.trailer_url = "https://www.youtube.com/embed/JfVOs4VSpmA"
RETURN m.title, m.trailer_url;

// Joker (2019)
MATCH (m:Movie {title: "Joker"})
SET m.trailer_url = "https://www.youtube.com/embed/zAGVQLHvwOY"
RETURN m.title, m.trailer_url;

// Black Panther (2018)
MATCH (m:Movie {title: "Black Panther"})
SET m.trailer_url = "https://www.youtube.com/embed/xjDjIWPwcPU"
RETURN m.title, m.trailer_url;

// Top Gun: Maverick (2022)
MATCH (m:Movie {title: "Top Gun: Maverick"})
SET m.trailer_url = "https://www.youtube.com/embed/giXco2jaZ_4"
RETURN m.title, m.trailer_url;

// Dune (2021)
MATCH (m:Movie {title: "Dune"})
SET m.trailer_url = "https://www.youtube.com/embed/8g18jFHCLXk"
RETURN m.title, m.trailer_url;

// Oppenheimer (2023)
MATCH (m:Movie {title: "Oppenheimer"})
SET m.trailer_url = "https://www.youtube.com/embed/uYPbbksJxIg"
RETURN m.title, m.trailer_url;

// Barbie (2023)
MATCH (m:Movie {title: "Barbie"})
SET m.trailer_url = "https://www.youtube.com/embed/pBk4NYhWNMM"
RETURN m.title, m.trailer_url;

// The Batman (2022)
MATCH (m:Movie {title: "The Batman"})
SET m.trailer_url = "https://www.youtube.com/embed/mqqft2x_Aa4"
RETURN m.title, m.trailer_url;

// Guardians of the Galaxy (2014)
MATCH (m:Movie {title: "Guardians of the Galaxy"})
SET m.trailer_url = "https://www.youtube.com/embed/d96cjJhvlMA"
RETURN m.title, m.trailer_url;

// John Wick (2014)
MATCH (m:Movie {title: "John Wick"})
SET m.trailer_url = "https://www.youtube.com/embed/C0BMx-qxsP4"
RETURN m.title, m.trailer_url;

// Mad Max: Fury Road (2015)
MATCH (m:Movie {title: "Mad Max: Fury Road"})
SET m.trailer_url = "https://www.youtube.com/embed/hEJnMQG9ev8"
RETURN m.title, m.trailer_url;

// The Social Network (2010)
MATCH (m:Movie {title: "The Social Network"})
SET m.trailer_url = "https://www.youtube.com/embed/lB95KLmpLR4"
RETURN m.title, m.trailer_url;

// Parasite (2019)
MATCH (m:Movie {title: "Parasite"})
SET m.trailer_url = "https://www.youtube.com/embed/5xH0HfJHsaY"
RETURN m.title, m.trailer_url;

// Everything Everywhere All at Once (2022)
MATCH (m:Movie {title: "Everything Everywhere All at Once"})
SET m.trailer_url = "https://www.youtube.com/embed/wxN1T1uxQ2g"
RETURN m.title, m.trailer_url;

// No Time to Die (2021)
MATCH (m:Movie {title: "No Time to Die"})
SET m.trailer_url = "https://www.youtube.com/embed/BIhNsAtPbPI"
RETURN m.title, m.trailer_url;

// Vidéo de démonstration par défaut pour tous les autres films
MATCH (m:Movie)
WHERE m.trailer_url IS NULL
SET m.trailer_url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
RETURN count(m) as updated_movies;

// Vérifier que tous les films ont maintenant une bande-annonce
MATCH (m:Movie)
RETURN m.title, m.trailer_url
ORDER BY m.title
LIMIT 50;
