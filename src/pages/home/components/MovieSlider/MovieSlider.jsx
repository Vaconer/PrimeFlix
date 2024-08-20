import React, { useRef, useState } from 'react';
import MovieItem from '../MovieItem/MovieItem';

function MovieSlider({ films, ITEMS_PER_PAGE }) {
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollLeft = () => {
        setCurrentIndex(prevIndex => {
            const newIndex = Math.max(prevIndex - 1, 0);
            sliderRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
            return newIndex;
        });
    };

    const scrollRight = () => {
        setCurrentIndex(prevIndex => {
            const newIndex = Math.min(prevIndex + 1, Math.ceil(films.length / ITEMS_PER_PAGE) - 1);
            sliderRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
            return newIndex;
        });
    };

    return (
        <div className="slider-container">
            <button className="slider-button prev" onClick={scrollLeft}>&lt;</button>
            <div className="lista-filmes" ref={sliderRef}>
                {films.map((film) => (
                    <MovieItem key={film.id} film={film} />
                ))}
            </div>
            <button className="slider-button next" onClick={scrollRight}>&gt;</button>
        </div>
    );
}

export default MovieSlider;
