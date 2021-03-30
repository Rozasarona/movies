import React from 'react';
import './MovieCard.css'


function MovieCard ({backdrop_path, title, overview}) {

    return (
        <div class="moviesapp_film">
            <img src={backdrop_path} />
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