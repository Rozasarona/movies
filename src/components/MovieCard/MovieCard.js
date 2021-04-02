import React from 'react';
import './MovieCard.css';
import FilmCover from '../FilmCover/FilmCover';
import { format } from 'date-fns';
import { Spin } from 'antd';



function MovieCard ({poster_path, title, overview, configuration, release_date, loading}) {

    function cutOverview (overview, maxLength) {
        if (overview.length <= maxLength) return overview;
       
        for(let i=maxLength; i >=0; i--) {
            if(overview[i] === ' ') return overview.slice(0, i) + '...';
        }
    }

    let releaseDate = new Date(release_date);

    if (loading) {
        return <Spin size="large"/>
    }

    const spinner = loading ? <Spin /> : null;
    const content != loading ? <FilmCardView /> : null

    return (
        <div className="moviesapp_film">
            { spinner }
            { content }
        </div>
    );
}

export default MovieCard;


const FilmCardView = () => {
    return (
       <React.Fragment>
           <FilmCover
               configuration = { configuration } 
               poster_path = { poster_path } />
            <div className="moviesapp_content">
                <h2>{title}</h2>
                <span className="filmDate">{ format(releaseDate, 'MMMM d, yyyy') }</span><br/><br/>
                <button>Action</button>&nbsp;
                <button>Drama</button><br/><br/>
                <p>{ cutOverview(overview, 130) }</p>
            </div>
       </React.Fragment> 
    )
}

    
    