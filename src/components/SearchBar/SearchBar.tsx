import { useRef } from "react";
import css from "./SearchBar.module.css";
import toast from "react-hot-toast";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

function SearchBar({ onSubmit }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form
          className={css.form}
          action={async (formData: FormData) => {
            const value = (formData.get("query") as string).trim();
            if (!value) {
              toast.error("Please enter your search query.");
              return;
            }
            onSubmit(value);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        >
          <input
            ref={inputRef}
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

export default SearchBar;
