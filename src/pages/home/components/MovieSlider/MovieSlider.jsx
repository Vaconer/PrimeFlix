import React, { useEffect, useMemo, useState } from 'react';
import MovieItem from '../MovieItem/MovieItem';

const TRANSITION = 'transform 450ms cubic-bezier(.22,.61,.36,1)';

function MovieSlider({ films, ITEMS_PER_PAGE = 5 }) {
  const [isMobile, setIsMobile] = useState(false);
  const [index, setIndex] = useState(0);   // índice do slide-page atual (com clones)
  const [anim, setAnim] = useState(false); // controla se a transição está ativa (evita “pulo” no teleporte)

  /* ====== Detecta mobile (<=576px) ====== */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 576px)');
    const handle = () => setIsMobile(mq.matches);
    handle();
    mq.addEventListener ? mq.addEventListener('change', handle) : mq.addListener(handle);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', handle) : mq.removeListener(handle);
    };
  }, []);

  /* ====== Paginação dos filmes ====== */
  const pages = useMemo(() => {
    if (!films || !films.length) return [[]];
    const out = [];
    for (let i = 0; i < films.length; i += ITEMS_PER_PAGE) {
      out.push(films.slice(i, i + ITEMS_PER_PAGE));
    }
    return out;
  }, [films, ITEMS_PER_PAGE]);

  const realCount = pages.length;

  /* ====== Clones p/ loop infinito (primeira e última páginas) ====== */
  const loopedPages = useMemo(() => {
    if (realCount <= 1) return pages; // sem loop se só 1 página
    return [pages[realCount - 1], ...pages, pages[0]];
  }, [pages, realCount]);

  /* Começa na 1ª página real (índice 1, pois 0 é o clone do último) */
  useEffect(() => {
    setIndex(realCount > 1 ? 1 : 0);
    setAnim(false);
  }, [realCount]);

  const canSlide = !isMobile && realCount > 1;

  /* ====== Navegação ====== */
  const scrollLeft = () => {
    if (!canSlide || anim) return;
    setAnim(true);
    setIndex((i) => i - 1);
  };

  const scrollRight = () => {
    if (!canSlide || anim) return;
    setAnim(true);
    setIndex((i) => i + 1);
  };

  /* ====== Teleporte ao fim da transição (para manter o loop) ====== */
  const onTransitionEnd = () => {
    if (!canSlide) return;
    if (index === 0) {
      // estava no clone do último → vai para o último real
      setAnim(false);
      setIndex(realCount);
      return;
    }
    if (index === realCount + 1) {
      // estava no clone do primeiro → vai para o primeiro real
      setAnim(false);
      setIndex(1);
      return;
    }
    // transição normal terminou
    setAnim(false);
  };

  return (
    <div className={`slider-container${isMobile ? ' is-mobile' : ''}`}>
      <button
        className="slider-button prev"
        onClick={scrollLeft}
        disabled={!canSlide}
        aria-label="Anterior"
      >
        ‹
      </button>

      {isMobile ? (
        /* Mobile: lista empilhada padrão (mantém seus estilos e tamanho) */
        <div className="lista-filmes stack" role="list">
          {films.map((film) => (
            <MovieItem key={film.id} film={film} />
          ))}
        </div>
      ) : (
        /* Desktop/Tablet: trilho com páginas + clones (loop infinito) */
        <div
          className="slider-track"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: anim ? TRANSITION : 'none',
          }}
          onTransitionEnd={onTransitionEnd}
          role="group"
          aria-roledescription="carousel"
        >
          {loopedPages.map((page, pIdx) => (
            <div className="slide-page" key={`page-${pIdx}`}>
              {page.map((film) => (
                <MovieItem key={`${pIdx}-${film.id}`} film={film} />
              ))}
            </div>
          ))}
        </div>
      )}

      <button
        className="slider-button next"
        onClick={scrollRight}
        disabled={!canSlide}
        aria-label="Próximo"
      >
        ›
      </button>
    </div>
  );
}

export default MovieSlider;
