import React from 'react';
import './MovieCard.css';
import FilmCover from '../FilmCover/FilmCover'


function MovieCard ({poster_path, title, overview, configuration}) {

    function cutOverview (overview, maxLength) {
        if (overview.length <= maxLength) return overview;
       
        for(let i=maxLength; i >=0; i--) {
            if(overview[i] == ' ') return overview.slice(0, i) + '...';
        }
    }

    return (
        <div className="moviesapp_film">
            <FilmCover
               configuration = { configuration } 
               poster_path = { poster_path } />
            <div className="moviesapp_content">
                <h2>{title}</h2>
                <p>March 5, 2020</p>
                <button>Action</button>
                <button>Drama</button><br/><br/>
                <p>{ cutOverview(overview, 245) }</p>
            </div>
        </div>
    );
}

export default MovieCard;



    
    