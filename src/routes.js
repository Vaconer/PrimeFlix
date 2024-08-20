import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import api from './services/api'; // Supondo que você tenha este arquivo para interagir com a API

import Home from './pages/home';
import Filme from './pages/filmes';
import Header from "./components/Header";
import Favoritos from './pages/favoritos';

function RoutesApp() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("now_playing");
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        async function loadGenres() {
            try {
                const response = await api.get("genre/movie/list", {
                    params: {
                        api_key: "c37d549444046fa2870249ba2c5deb22",
                        language: "pt-br"
                    }
                });
                setGenres(response.data.genres);
            } catch (error) {
                console.error("Erro ao carregar gêneros:", error);
            }
        }

        loadGenres();
    }, []);

    const handleSearch = (term) => {
        const newTerm = term.length ? term : null
        setSearchTerm(newTerm);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSelectedGenre(null); // Reset genre when category changes
    };

    const handleGenreChange = (genreId) => {
        setSelectedGenre(genreId);
        setSelectedCategory(null); // Reset category when genre changes
    };

    return (
        <BrowserRouter>
            <Header 
            
                onSearch={handleSearch} 
                onCategoryChange={handleCategoryChange} 
                onGenreChange={handleGenreChange}
                genres={genres} // Pass the list of genres to the Header
            />
            
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <Home 
                            searchTerm={searchTerm} 
                            selectedCategory={selectedCategory} 
                            selectedGenre={selectedGenre} 
                        />
                    } 
                />
                <Route path="/filme/:id" element={<Filme />} />
                <Route path="/favoritos" element={<Favoritos />} />
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesApp;
