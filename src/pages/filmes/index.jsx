import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './filme-info.css';

import api from '../../services/api';
import { toast } from 'react-toastify';

function Filme() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [filme, setFilme] = useState({});
    const [elenco, setElenco] = useState([]); // Novo estado para o elenco
    const [loading, setLoading] = useState(true);

    async function loadFilme() {
        try {
            const filmeResponse = await api.get(`/movie/${id}`, {
                params: {
                    api_key: "c37d549444046fa2870249ba2c5deb22",
                    language: "pt-br",
                }
            });
            setFilme(filmeResponse.data);

            // Carregar informações do elenco
            const elencoResponse = await api.get(`/movie/${id}/credits`, {
                params: {
                    api_key: "c37d549444046fa2870249ba2c5deb22",
                    language: "pt-br",
                }
            });
            setElenco(elencoResponse.data.cast);

            setLoading(false);
        } catch (error) {
            navigate('/', { replace: true });
            return;
        }
    }

    useEffect(() => {
        if (navigate && id) {
            loadFilme();
        }
    }, [navigate, id]);

    function salvarFilme() {
        const minhaLista = localStorage.getItem("@primeFlix");
        let filmesSalvos = JSON.parse(minhaLista) || [];
        const hasFilme = filmesSalvos.some((filmeSalvo) => filmeSalvo.id === filme.id);

        if (hasFilme) {
            toast.warn("Esse filme já está na sua lista");
            return;
        }

        filmesSalvos.push(filme);
        localStorage.setItem("@primeFlix", JSON.stringify(filmesSalvos));
        toast.success("Filme salvo com sucesso!");
    }

    if (loading) {
        return (
            <div className='filme-info'>
                <h1>Carregando detalhes...</h1>
            </div>
        );
    }

    // Define the background image, defaulting to poster_path if backdrop_path is unavailable
    const backgroundImage = filme.backdrop_path 
        ? `https://image.tmdb.org/t/p/original/${filme.backdrop_path}` 
        : filme.poster_path 
            ? `https://image.tmdb.org/t/p/original/${filme.poster_path}` 
            : '';

    return (
        <div
            className='filme-info'
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="content">
                <h1>{filme.title}</h1>
                <div className="details">
                    <h2>Sinopse</h2>
                    <p>{filme.overview}</p>
                    <strong><span className="avaliacao-texto">Avaliação:</span> {filme.vote_average} / 10</strong>
                    
                    <div className='area-buttons'>
                        <button onClick={salvarFilme}>
                            Salvar
                        </button>
                        <button>
                            <a target='_blank' rel='noopener noreferrer' href={`https://youtube.com/results?search_query=${filme.title} Trailer`}>
                                Trailer
                            </a>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Filme;
