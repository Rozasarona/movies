import React from 'react';
import { format } from 'date-fns';
import { Rate } from 'antd';

import FilmCover from '../FilmCover/FilmCover';
import AverageRating from '../AverageRating/AverageRating';

import { GenresContext, ConfigurationContext } from '../ReactContexts';

import './MovieCard.css';

function cutOverview (overview, maxLength) {
    if (overview.length <= maxLength) return overview;

    for (let i = maxLength; i >= 0; i--) {
        if (overview[i] === ' ') return overview.slice(0, i) + '...';
    }
}

function MovieCard ({id, poster_path, title, overview, release_date, genre_ids, onRateChange, rating, vote_average}) {
    let parsedReleaseDate = null;
    if (release_date) {
        parsedReleaseDate = new Date(release_date);
    }

    const onRateChangeInternal = (value) => onRateChange(id, value);

    return (
        <GenresContext.Consumer>
            {allGenres => 
                <ConfigurationContext.Consumer>
                    {configuration => {
                        const genres = genre_ids.map(genre_id => allGenres.find(genre => genre.id === genre_id));

                        return (
                            <div className="moviesapp_film">
                                <FilmCover
                                    configuration={configuration}
                                    poster_path={poster_path} />
                                <div className="moviesapp_content">
                                    <div className="content_header">
                                        <h2>{title}</h2>
                                        <AverageRating value={vote_average} />
                                    </div>
                                    <span className="filmDate">{parsedReleaseDate && format(parsedReleaseDate, 'MMMM d, yyyy')}</span><br/>
                                    {genres.map(genre => (<button className="btn_genre" key={genre.id}>{genre.name}</button>))}
                                    <br/>
                                    <p>{cutOverview(overview, 130)}</p>
                                    <Rate count={10} onChange={onRateChangeInternal} value={rating} />
                                </div>
                            </div>
                        );
                    }}
                </ConfigurationContext.Consumer>
            }
        </GenresContext.Consumer>
    );
}

export default MovieCard;
