import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './FilmList.css';

function FilmList({ films, configuration, onRateChange }) {
    let films2 = films.map((item) => (
        <MovieCard
            id={item.id}
            key = {item.id}
            poster_path={item.poster_path}
            title={item.title}
            overview={item.overview}
            release_date={item.release_date}
            configuration={configuration}
            genre_ids={item.genre_ids}
            onRateChange={onRateChange}
            rating={item.rating} />
    ));

    return (
        <section className="moviesapp">
            { films2 }
        </section>
    );
}

export default FilmList;