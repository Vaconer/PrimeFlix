import { useEffect, useState } from "react";
import api from "../../services/api";
import FeaturedMovie from "./components/FeatureMovie/FeaturedMovie";
import MovieSlider from "./components/MovieSlider/MovieSlider"
import './home.css';

function Home({ searchTerm, selectedCategory, selectedGenre }) {
    const [Filmes, setFilmes] = useState([]);
    const [filteredFilmes, setFilteredFilmes] = useState([]);
    const [featuredIndex, setFeaturedIndex] = useState(0);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        async function loadFilmes() {
            try {
                const params = {
                    api_key: "c37d549444046fa2870249ba2c5deb22",
                    language: "pt-br",
                    page: 1,
                };

                let filmes = [];
                if (searchTerm) {
                    params.query = searchTerm;
                    const response = await api.get('search/movie', { params });
                    filmes = response.data.results;
                } else if (selectedGenre) {
                    params.with_genres = selectedGenre;
                    const response = await api.get('discover/movie', { params });
                    filmes = response.data.results;
                } else if (selectedCategory) {
                    const validCategories = ['now_playing', 'top_rated', 'popular', 'upcoming'];
                    if (validCategories.includes(selectedCategory)) {
                        const response = await api.get(`movie/${selectedCategory}`, { params });
                        filmes = response.data.results;
                    } else {
                        console.error("Categoria inválida:", selectedCategory);
                    }
                } else {
                    console.error("Nenhum termo de pesquisa, categoria ou gênero selecionado");
                }

                const filmesValidos = filmes.filter(filme => (filme.backdrop_path || filme.poster_path) && filme.overview);

                setFilmes(filmesValidos);
                setFilteredFilmes(filmesValidos);

            } catch (error) {
                console.error("Erro ao carregar filmes:", error);
            }
        }

        loadFilmes();
    }, [searchTerm, selectedCategory, selectedGenre]);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredFilmes(Filmes);
        }
    }, [Filmes]);

    useEffect(() => {
        const interval = setInterval(() => {
            setFeaturedIndex(prevIndex => {
                const newIndex = (prevIndex + 1) % filteredFilmes.length;
                return newIndex;
            });
        }, 20000);

        return () => clearInterval(interval);
    }, [filteredFilmes]);

    const featuredFilm = filteredFilmes[featuredIndex];

    return (
        <div className="container">
            <FeaturedMovie film={featuredFilm} />
            <MovieSlider films={filteredFilmes} ITEMS_PER_PAGE={ITEMS_PER_PAGE} />
        </div>
    );
}

export default Home;
