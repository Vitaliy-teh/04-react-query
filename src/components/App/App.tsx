import { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim() === "") return;
    setQuery(newQuery);
    setPage(1);
  };

  useEffect(() => {
    const loadMovies = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchMovies({ query, page });
        if (!data.results || data.results.length === 0) {
          toast.error("No movies found for your request.");
          setMovies([]);
          setTotalPages(0);
        } else {
          setMovies(data.results);
          setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
        }
      } catch {
        setError("There was an error while fetching movies.");
        toast.error("There was an error while fetching movies.");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [query, page]);

  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  return (
    <div className={css.app}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            textAlign: "center",
          },
        }}
      />

      <SearchBar onSubmit={handleSearch} />

      {loading && <Loader />}

      {!loading && error && <ErrorMessage />}

      {!loading && !error && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={handleSelect} />
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
