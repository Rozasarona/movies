import React from 'react';
import { format } from 'date-fns';
import 'antd/dist/antd.css';
import { Rate, Image } from 'antd';


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
                        const latest_poster_size_index = configuration.images.poster_sizes.length - 1;
                        const poster_size_original = configuration.images.poster_sizes[latest_poster_size_index];
                        const url = poster_path
                        ? `${configuration.images.base_url}${poster_size_original}${poster_path}`
                        : 'https://via.placeholder.com/183x281.png?text=No+Cover';
                        return (
                            <div className="moviesapp_film">
                                <Image
                                    width={183}
                                    height={281}
                                    src={ url }
                                />
                                <div className="moviesapp_content">
                                    <div className="content_header">
                                        <h2>{title}</h2>
                                        <AverageRating value={vote_average} />
                                    </div>
                                    <div className="content_body">
                                        <span className="filmDate">{parsedReleaseDate && format(parsedReleaseDate, 'MMMM d, yyyy')}</span>
                                        <ul className="content_genres">
                                            {genres.map(genre => (
                                                <li className="btn_genre" key={genre.id}>{genre.name}</li>
                                            ))}
                                        </ul>
                                        <p>{cutOverview(overview, 130)}</p>
                                    </div>
                                    <Rate count={10} onChange={onRateChangeInternal} value={rating} allowHalf />
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
