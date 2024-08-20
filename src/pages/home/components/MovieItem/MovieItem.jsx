import React from 'react';
import { Link } from 'react-router-dom';

function MovieItem({ film }) {
    const getImageSrc = (path) => `https://image.tmdb.org/t/p/original/${path}`;

    return (
        <article key={film.id}>
            <img
                src={getImageSrc(film.backdrop_path || film.poster_path)}
                alt={film.title}
            />
            <Link to={`/filme/${film.id}`} className="featured-link">Acessar</Link>
        </article>
    );
}

export default MovieItem;
