import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './filme-info.css';

import api from '../../services/api';
import { toast } from 'react-toastify';

function Filme() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [filme, setFilme] = useState({});
    const [elenco, setElenco] = useState([]);
    const [loading, setLoading] = useState(true);

    // Formatar duração
    function formatRuntime(mins) {
        if (!mins) return 'Duração não disponível';
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        return `${hours}h ${minutes}min`;
    }

    async function loadFilme() {
        try {
            const filmeResponse = await api.get(`/movie/${id}`, {
                params: {
                    api_key: "c37d549444046fa2870249ba2c5deb22",
                    language: "pt-br",
                }
            });
            setFilme(filmeResponse.data);

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
                {/* Poderia substituir por skeleton aqui */}
                <h1>Carregando detalhes...</h1>
            </div>
        );
    }

    const backgroundImage = filme.backdrop_path
        ? `https://image.tmdb.org/t/p/original/${filme.backdrop_path}`
        : filme.poster_path
            ? `https://image.tmdb.org/t/p/original/${filme.poster_path}`
            : '';

    return (
        <div
            className="filme-info"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                color: '#fff',
            }}
        >
            <div className="overlay" /> {/* Um overlay escuro para melhorar contraste */}

            <div className="filme-container">
                <div className="poster-section">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${filme.poster_path || filme.backdrop_path}`}
                        alt={filme.title}
                        className="filme-poster"
                    />
                </div>

                <div className="info-section">
                    <h1 className="filme-title">{filme.title}</h1>
                    <p className="filme-tagline">{filme.tagline}</p>
                    <p className="filme-overview">{filme.overview}</p>

                    <div className="filme-details">
                        <p><strong>Gêneros:</strong> {filme.genres?.map(g => g.name).join(', ') || 'Indisponível'}</p>
                        <p><strong>Duração:</strong> {formatRuntime(filme.runtime)}</p>
                        <p><strong>Lançamento:</strong> {filme.release_date || 'Indisponível'}</p>
                        <p><strong>Idioma:</strong> {filme.original_language?.toUpperCase() || 'Indisponível'}</p>
                        <p><strong>Avaliação:</strong> ⭐ {filme.vote_average} / 10</p>
                    </div>

                    <div className="action-buttons">
                        <button onClick={salvarFilme} className="btn-primary">Salvar</button>
                        <a
                            href={`https://youtube.com/results?search_query=${filme.title} Trailer`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary"
                        >
                            Trailer
                        </a>
                    </div>

                    {elenco.length > 0 && (
                        <section className="cast-section">
                            <h2>Elenco Principal</h2>
                            <div className="cast-list">
                                {elenco.slice(0, 10).map(actor => (
                                    <div key={actor.cast_id || actor.credit_id || actor.id} className="actor-card">
                                        <img
                                            src={actor.profile_path
                                                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                                : '/default-avatar.png'}
                                            alt={actor.name}
                                            loading="lazy"
                                            className="actor-photo"
                                        />
                                        <p className="actor-name">{actor.name}</p>
                                        <p className="character-name">{actor.character}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );

}

export default Filme;
