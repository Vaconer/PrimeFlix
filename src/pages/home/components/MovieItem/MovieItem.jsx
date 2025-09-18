import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function MovieItem({ film }) {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const {
    id,
    title: rawTitle,
    name,
    release_date,
    first_air_date,
    vote_average,
    original_language,
    backdrop_path,
    poster_path,
  } = film || {};

  const title = useMemo(() => rawTitle || name || 'Sem título', [rawTitle, name]);

  const year = useMemo(() => {
    const d = release_date || first_air_date;
    return d ? d.slice(0, 4) : '';
  }, [release_date, first_air_date]);

  const rating = useMemo(
    () => (typeof vote_average === 'number' ? vote_average.toFixed(1) : null),
    [vote_average]
  );

  const lang = useMemo(
    () => (original_language ? original_language.toUpperCase() : ''),
    [original_language]
  );

  const preferredPath = useMemo(
    () => backdrop_path || poster_path || null,
    [backdrop_path, poster_path]
  );

  const tmdb = (path, size = 'original') =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : '';

  const srcSet = useMemo(() => {
    if (!preferredPath) return undefined;
    return [
      `${tmdb(preferredPath, 'w342')} 342w`,
      `${tmdb(preferredPath, 'w500')} 500w`,
      `${tmdb(preferredPath, 'w780')} 780w`,
      `${tmdb(preferredPath, 'w1280')} 1280w`,
      `${tmdb(preferredPath, 'original')} 2000w`,
    ].join(', ');
  }, [preferredPath]);

  const sizes = '(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw';
  const posterAlt = `${title}${year ? ` (${year})` : ''}`;

  const captionId = `film-caption-${id}`;
  const titleId = `film-title-${id}`;

  const goToDetails = () => navigate(`/filme/${id}`);

  return (
    <article className="movie-card" aria-labelledby={titleId}>
      <figure className="poster-wrap">
        {!imgError && preferredPath ? (
          <picture onClick={goToDetails} aria-label={`Ver detalhes do filme: ${title}`}>
            <source media="(min-width: 1024px)" srcSet={tmdb(preferredPath, 'w1280')} />
            <source media="(min-width: 640px)" srcSet={tmdb(preferredPath, 'w780')} />
            <img
              src={tmdb(preferredPath, 'w500')}
              srcSet={srcSet}
              sizes={sizes}
              alt={posterAlt}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
            />
          </picture>
        ) : (
          <div
            className="poster-fallback"
            aria-hidden="false"
            onClick={goToDetails}
            aria-label={`Ver detalhes do filme: ${title}`}
          >
            {title}
          </div>
        )}

        <figcaption id={captionId} className="film-caption">
          <h3 id={titleId} className="film-title" title={title}>
            {title}
          </h3>
          <div className="film-meta">
            {year && <span className="film-chip">{year}</span>}
            {lang && <span className="film-chip">{lang}</span>}
            {rating && <span className="film-chip">★ {rating}</span>}
          </div>
        </figcaption>
      </figure>

      <Link
        to={`/filme/${id}`}
        className="featured-link"
        aria-label={`Ver detalhes do filme: ${title}`}
        aria-describedby={captionId}
        title={`Ver detalhes do filme: ${title}`}
      >
        Detalhes
      </Link>
    </article>
  );
}

export default MovieItem;
