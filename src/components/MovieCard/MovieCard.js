import React from 'react';
import { format } from 'date-fns';
import { Rate } from 'antd';

import FilmCover from '../FilmCover/FilmCover';
import GenresContext from '../GenresContext';

import './MovieCard.css';

function cutOverview (overview, maxLength) {
    if (overview.length <= maxLength) return overview;

    for (let i = maxLength; i >= 0; i--) {
        if (overview[i] === ' ') return overview.slice(0, i) + '...';
    }
}

function MovieCard ({id, poster_path, title, overview, configuration, release_date, genre_ids, onRateChange, rating}) {
    let parsedReleaseDate = null;
    if (release_date) {
        parsedReleaseDate = new Date(release_date);
    }

    const onRateChangeInternal = (value) => onRateChange(id, value);

    return (
        <GenresContext.Consumer>
            {allGenres => {
                const genres = genre_ids.map(genre_id => allGenres.find(genre => genre.id === genre_id));

                return (
                    <div className="moviesapp_film">
                        <FilmCover
                            configuration={configuration}
                            poster_path={poster_path} />
                        <div className="moviesapp_content">
                            <h2>{title}</h2>
                            <span className="filmDate">{parsedReleaseDate && format(parsedReleaseDate, 'MMMM d, yyyy')}</span><br/><br/>
                            {genres.map(genre => (<button key={genre.id}>{genre.name}</button>))}
                            <br/><br/>
                            <p>{cutOverview(overview, 130)}</p>
                            <Rate count={10} onChange={onRateChangeInternal} value={rating} />
                        </div>
                    </div>
                );
            }}
        </GenresContext.Consumer>
    );
}

export default MovieCard;
