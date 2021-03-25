import React from 'react';
import MovieCard from '../MovieCard/MovieCard';

function FilmList({ films }) {
    let films1 = films.slice(0,6);
let films2 = films1.map((item) => (
	<MovieCard 
        backdrop_path={item.backdrop_path} 
        title={item.title} 
        overview={item.overview} />
));

    return films2;
}

export default FilmList;