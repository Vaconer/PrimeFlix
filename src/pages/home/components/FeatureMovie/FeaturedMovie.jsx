import React from 'react';
import { Link } from 'react-router-dom';

function FeaturedMovie({ film }) {
    const getImageSrc = (path) => `https://image.tmdb.org/t/p/original/${path}`;

    return (
        <div className="featured-movie">
            {film && (
                <>
                    <img
                        className="featured-backdrop"
                        src={getImageSrc(film.backdrop_path || film.poster_path)}
                        alt={film.title}
                    />
                    <div className="featured-info">
                        <h1 className="h">{film.title}</h1>

                        <p>
                            {film.overview.length > 300
                                ? film.overview.slice(0, 300) + '...'
                                : film.overview}
                        </p>

                        <p className="featured-rating">⭐ {film.vote_average.toFixed(1)} / 10</p>

                        <Link to={`/filme/${film.id}`} className="featured-link">Acessar</Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default FeaturedMovie;
