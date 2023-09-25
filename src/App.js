import { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating";
import { useLocalStorage } from "./useLocalStorage";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>movieNoter</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  let inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.focus();
  }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}
function MoviesList({ movies, handleSelectedMovieClick }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie
          handleSelectedMovieClick={handleSelectedMovieClick}
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </ul>
  );
}
function Movie({ movie, handleSelectedMovieClick }) {
  return (
    <li onClick={() => handleSelectedMovieClick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMovie({ movie, onhandleDelete }) {
  return (
    <>
      <li key={movie.imdbID}>
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <h3>{movie.title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
        </div>
      </li>
      <button onClick={() => onhandleDelete(movie.imdbID)}>Delete</button>
    </>
  );
}
function WatchedMoviesList({ watched, onhandleDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          onhandleDelete={onhandleDelete}
          movie={movie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}
function SelectedMovies({
  handleSetWatch,
  selectedMovie,
  handleCLoseSelectedMovie,
  watched,
}) {
  const [userRating, setUserRating] = useState(0);
  const [movieData, setMovieData] = useState({});
  const countRef = useRef(0);
  useEffect(() => {
    if (userRating) countRef.current = countRef + 1;
  }, [userRating]);
  useEffect(() => {
    const callback = (e) => {
      if (e.code === "Escape") {
        handleCLoseSelectedMovie();
      }
    };
    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [handleCLoseSelectedMovie]);

  useEffect(() => {
    async function getMovieData() {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovie}`
      );
      const data = await res.json();
      setMovieData(data);
    }
    getMovieData();
  }, [selectedMovie]);
  const {
    imdbID,
    Director: director,
    Title: title,
    Runtime: runtime,
    Poster: poster,
    Actors: actors,
    Plot: plot,
    Released: released,
    Genre: genre,
    Year: year,
    imdbRating,
  } = movieData;
  const userRatingCurrent = watched.find(
    (val) => val.imdbID === imdbID
  )?.userRating;
  useEffect(() => {
    document.title = `Movie- ${title}`;
    return () => {
      document.title = title;
    };
  }, [title]);
  const handleAddCart = () => {
    const newObj = {
      title,
      imdbRating: Number(imdbRating),
      runtime: runtime.split(" ").at(0),
      year,
      poster,
      imdbID: selectedMovie,
      userRating,
      countRef,
    };
    handleSetWatch(newObj);
    handleCLoseSelectedMovie();
  };
  return (
    <div>
      <header>
        <button onClick={handleCLoseSelectedMovie} className="btn btn-back">
          Back
        </button>
        <img src={poster} alt={`Poster of ${title}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <span>{imdbRating}:IMBD Rating</span>
        </div>
      </header>
      <section>
        <div className="rating">
          {watched.some((ele) => ele.imdbID === imdbID) ? (
            <p>You already rated this movie {userRatingCurrent}</p>
          ) : (
            <StarRating
              onSetUserRating={setUserRating}
              maxStars={10}
              size={24}
            />
          )}
        </div>
        <button onClick={handleAddCart} className="btn btn-add">
          ADD TO CART
        </button>
        <p>
          <em>{plot}</em>
        </p>
        <p>Directed By {director}</p>
        <p>Sarring {actors}</p>
      </section>
    </div>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
const KEY = "e116d488";
export default function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useLocalStorage([], "watched");

  const handleSetWatch = (newObj) => {
    setWatched((curr) => [...curr, newObj]);
  };
  const handleDelete = (imdbID) => {
    setWatched((curr) => curr.filter((c) => c.imdbID !== imdbID));
  };

  const handleSelectedMovieClick = (id) => {
    setSelectedMovie((selectedMovie) => (selectedMovie === id ? null : id));
  };
  const handleCLoseSelectedMovie = () => {
    setSelectedMovie(null);
  };
  useEffect(() => {
    async function fetchMovies() {
      try {
        setError("");
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );
        if (!res.ok) throw new Error("Cannot fetch data");
        const data = await res.json();
        setMovies(data.Search);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
        if (query.length === 0) setMovies([]);
      }
    }
    fetchMovies();
  }, [query]);
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading ? (
            <p className="loader">LOADING</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <MoviesList
              handleSelectedMovieClick={handleSelectedMovieClick}
              movies={movies}
            />
          )}
        </Box>
        <Box>
          {selectedMovie ? (
            <SelectedMovies
              watched={watched}
              handleSetWatch={handleSetWatch}
              handleCLoseSelectedMovie={handleCLoseSelectedMovie}
              selectedMovie={selectedMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                onhandleDelete={handleDelete}
                watched={watched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
