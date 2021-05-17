import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './FilmList.css';

function renderFilmList(films, configuration) {
    let films2 = films.map((item) => (
        <MovieCard
            key = {item.id}
            poster_path={item.poster_path}
            title={item.title}
            overview={item.overview}
            release_date={item.release_date}
            configuration={configuration}
            genre_ids={item.genre_ids} />
    ));

    return (
        <section className="moviesapp">
            { films2 }
        </section>
    );
}

function FilmList({ films, configuration }) {
    return renderFilmList(films, configuration);
}

export default FilmList;