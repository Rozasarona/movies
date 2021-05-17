import React from 'react';
import './MovieCard.css';
import FilmCover from '../FilmCover/FilmCover';
import { GenresContext } from '../GenresContext';
import { format } from 'date-fns';

function MovieCard ({poster_path, title, overview, configuration, release_date, genre_ids}) {

    function cutOverview (overview, maxLength) {
        if (overview.length <= maxLength) return overview;

        for(let i=maxLength; i >=0; i--) {
            if(overview[i] === ' ') return overview.slice(0, i) + '...';
        }
    }

    let releaseDate = null;
    if (release_date) {
        releaseDate = new Date(release_date);
    }

    return (
        <GenresContext.Consumer>
            { allGenres => {
                const genreNames = genre_ids.map(genre_id => allGenres.find(genre => genre.id === genre_id).name);
                return (
                    <div className="moviesapp_film">
                        <FilmCover
                            configuration = { configuration }
                            poster_path = { poster_path } />
                        <div className="moviesapp_content">
                            <h2>{title}</h2>
                            <span className="filmDate">{ releaseDate && format(releaseDate, 'MMMM d, yyyy') }</span><br/><br/>
                            {genreNames.map(genre_name => (<button>{genre_name}</button>))}
                            <br/><br/>
                            <p>{ cutOverview(overview, 130) }</p>
                        </div>
                    </div>
                );
            }}
        </GenresContext.Consumer>
    );
}

export default MovieCard;



