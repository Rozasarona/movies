import React from 'react';
import { Pagination } from 'antd';
import MovieCard from '../MovieCard/MovieCard';
import './FilmList.css';

function FilmList({ films, onRateChange, filmsTotal, currentPage, pageChangeHandler }) {
    let films2 = films.map((item) => (
        <MovieCard
            id={item.id}
            key = {item.id}
            poster_path={item.poster_path}
            title={item.title}
            overview={item.overview}
            release_date={item.release_date}
            genre_ids={item.genre_ids}
            onRateChange={onRateChange}
            rating={item.rating}
            vote_average={item.vote_average} />
    ));

    return (<>
        <main className="moviesapp">
            { films2 }
        </main>
        <div className="paginationContainer">
            <Pagination
                size="small"
                total={filmsTotal}
                defaultPageSize={20}
                defaultCurrent={currentPage}
                hideOnSinglePage={true}
                showSizeChanger={false}
                onChange={pageChangeHandler} />
        </div>
    </>);
}

export default FilmList;