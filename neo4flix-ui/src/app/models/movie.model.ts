export interface Movie {
  id: string;
  title: string;
  releaseDate: Date;
  genres: string[];
  averageRating: number;
  poster?: string;
  plot?: string;
  trailerUrl?: string;
}

export interface Rating {
  id?: number;
  userId: string;
  movieId: string;
  movieTitle?: string;
  moviePoster?: string;
  rating: number;
  review?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MovieRecommendation {
  movie: Movie;
  score: number;
  reason: string;
}
