import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import type { MovieResponse } from "../../services/movieService";
import { fetchMovies } from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showNoResultsToast, setShowNoResultsToast] = useState(false);

  const placeholder: MovieResponse = {
    page: 1,
    results: [],
    total_pages: 0,
    total_results: 0,
  };

  const {
  data = placeholder,
  isLoading,
  isError,
  isSuccess,
  isFetching,
} = useQuery<MovieResponse, Error>({
  queryKey: ["movies", query, page],
  queryFn: () => fetchMovies({ query, page }),
  enabled: !!query,
  initialData: placeholder,
  placeholderData: keepPreviousData,
});



  
  useEffect(() => {
  if (!isSuccess || isFetching || !showNoResultsToast) return;

  if (data.results.length === 0) {
    toast.error("No movies found for your request.");
  }

  setShowNoResultsToast(false);
}, [isSuccess, isFetching, showNoResultsToast, data]);



  const handleSearch = (newQuery: string) => {
    if (newQuery.trim() === "") return;
    
    setQuery(newQuery);
    setPage(1);
    setShowNoResultsToast(true);
  };

  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const movies = data.results;
  const totalPages = data?.total_pages ? Math.min(data.total_pages, 500) : 0;


  return (
    <div className={css.app}>
      <Toaster
        position="top-center"
        toastOptions={{ style: { textAlign: "center" } }}
      />

      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && movies.length > 0 && (
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

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
}

export default App;
