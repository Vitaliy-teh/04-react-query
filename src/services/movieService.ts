import axios from "axios";
import type { Movie } from "../types/movie";

const API_URL = "https://api.themoviedb.org/3/search/movie";

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface FetchMoviesParams {
  query: string;
  page?: number;
  language?: string;
  include_adult?: boolean;
}

export async function fetchMovies({
  query,
  page = 1,
  language = "en-US",
  include_adult = false,
}: FetchMoviesParams): Promise<MovieResponse> {
  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

  if (!TMDB_TOKEN) {
    throw new Error("VITE_TMDB_TOKEN is not defined in environment variables");
  }

  const config = {
    params: {
      query,
      page,
      language,
      include_adult,
    },
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      accept: "application/json",
    },
  };

  const response = await axios.get<MovieResponse>(API_URL, config);
  return response.data;
}
