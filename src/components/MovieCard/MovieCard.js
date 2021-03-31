import React from 'react';
import './MovieCard.css';
import FilmCover from '../FilmCover/FilmCover'


function MovieCard ({backdrop_path, title, overview}) {

    return (
        <div class="moviesapp_film">
            <FilmCover 
               backdrop_path = {backdrop_path} />
            <div class="moviesapp_content">
                <h2>{title}</h2>
                <p>March 5, 2020</p>
                <button>Action</button>
                <button>Drama</button>
                <p>{overview}</p>
            </div>
        </div>
    );
}

export default MovieCard;