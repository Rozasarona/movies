import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './FilmList.css';



function FilmList({ films, configuration }) {
    let films1 = films.slice(0,6);
let films2 = films1.map((item) => (
	<MovieCard 
        key = {item.id}
        poster_path={item.poster_path} 
        title={item.title} 
        overview={item.overview}
        release_date={item.release_date}
        configuration={configuration} />
));

    return (
        <section className="moviesapp">
            { films2 }             
        </section>
    )
}

export default FilmList;