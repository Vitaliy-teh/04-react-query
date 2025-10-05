import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import css from "./App.module.css";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    
    setMovies([]);
    setError(null);

    try {
      setLoading(true);
      const data = await fetchMovies({ query, page: 1 });
      if (!data.results || data.results.length === 0) {
        toast.error("No movies found for your request.");
        setMovies([]);
      } else {
        setMovies(data.results);
      }
    } catch (err) {
      console.error(err);
      setError("There was an error while fetching movies.");
      toast.error("There was an error while fetching movies.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <SearchBar
        onSubmit={(q) => {
          handleSearch(q);
        }}
      />

      {loading && <Loader />}

      {!loading && error && <ErrorMessage />}

      {!loading && !error && <MovieGrid movies={movies} onSelect={handleSelect} />}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
