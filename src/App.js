import { useState, useEffect } from 'react';
import RoutesApp from "./routes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from "./services/api"; // Supondo que você tenha este arquivo para interagir com a API

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("now_playing");
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    async function loadGenres() {
      const response = await api.get("genre/movie/list", {
        params: {
          api_key: "c37d549444046fa2870249ba2c5deb22",
          language: "pt-br"
        }
      });

      setGenres(response.data.genres);
    }

    loadGenres();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleGenreChange = (genreId) => {
    // Aqui, você pode implementar a lógica para mudar a categoria com base no gênero selecionado, se necessário.
    setSelectedCategory(genreId);
  };

  return (
    <div>
      <ToastContainer autoClose={3000} />
      <RoutesApp 
        searchTerm={searchTerm} 
        selectedCategory={selectedCategory}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onGenreChange={handleGenreChange}
        genres={genres}
      />
    </div>
  );
}

export default App;