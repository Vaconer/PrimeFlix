import React from 'react';
import { Link } from 'react-router-dom';

function FeaturedMovie({ film }) {
    const getImageSrc = (path) => `https://image.tmdb.org/t/p/original/${path}`;

    return (
        <div className="featured-movie">
            {film && (
                <>
                    <img
                        src={getImageSrc(film.backdrop_path || film.poster_path)}
                        alt={film.title}
                    />
                    <div className="featured-info">
                        <h1 className="h">{film.title}</h1>
                        <p>{film.overview}</p>
                        <Link to={`/filme/${film.id}`} className="featured-link">Acessar</Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default FeaturedMovie;
