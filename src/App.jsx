import "./App.css";
import { useMovies } from './hooks/useMovies.js';
import { Movies } from "./components/Movies.jsx";
import { useEffect, useState, useRef, useCallback } from "react";
import debounce from "just-debounce-it";

function useSearch () {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

   useEffect(() => {
     if (isFirstInput.current) {
        isFirstInput.current = search === ''
        return
     }
     if (search === "") {
       setError("no se puede busacr una palícula vacía");
       return;
     }
     if (search.match(/^\d+$/)) {
       setError("no se puede buscar la película con un número");
       return;
     }
     if (search.length < 3) {
       setError("La busqueda debe de tener al menos 3 caracteres");
       return;
     }
     setError(null);
   }, [search]);

   return { search, updateSearch, error}
}

function App() {
  const [sort, setSort] = useState(false)
  // const inputRef = useRef()
  // const [query, setQuery] = useState('')
  const {search, updateSearch, error} = useSearch()
  const {movies, getMovies, loading} = useMovies({search, sort})

  const handleSubmit = (event) => {
    event.preventDefault()
    // const fields = new window.FormData(event.target)
    // const query = fields.get('query') forma descontrolada
    getMovies({search})

    // const { query } = Object.fromEntries(new window.formData(event.target)) javascrpt vanila
  }

  const debouncedGetMovies = useCallback(
    debounce(search => {
    getMovies({search})
  }, 300), [getMovies])

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch) //forma controlada
    debouncedGetMovies(newSearch)
  }

  return (
    <div className="page">
      <header>
        <h1>Bucador de peliculas</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            name="search"
            type="text"
            placeholder="Secreto en la montaña, mi chilala mi chilala"
            value={search}
          />
          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type="submit">Buscar</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </header>
      <main>{loading ? <p>Cargando...</p> : <Movies movies={movies} />}</main>
    </div>
  );
}

export default App;
