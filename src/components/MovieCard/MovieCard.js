import React from 'react';
import './MovieCard.css';
import FilmCover from '../FilmCover/FilmCover';
import { format } from 'date-fns';
import { Spin } from 'antd';
import { render } from '@testing-library/react';



class MovieCard extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    cutOverview = () => {
        const { overview, maxLength } = this.props;
        if (overview.length <= maxLength) return overview;
       
        for(let i=maxLength; i >=0; i--) {
            if(overview[i] === ' ') return overview.slice(0, i) + '...';
        }
    }
    
   
         
        render() {
            const { poster_path, title, overview, configuration, release_date } = this.props
            let releaseDate = new Date(release_date);            
            return (
                <div className="moviesapp_film">                    
                    <FilmCover
                        configuration = { configuration } 
                        poster_path = { poster_path } />
                    <div className="moviesapp_content">
                        <h2>{title}</h2>
                        <span className="filmDate">{ format(releaseDate, 'MMMM d, yyyy') }</span><br/><br/>
                        <button>Action</button>&nbsp;
                        <button>Drama</button><br/><br/>
                        <p>{ this.cutOverview(overview, 130) }</p>
                    </div>
                    
                </div>
            );
        };
}

export default MovieCard;



/* const FilmCardView = ({film}) => {
    const { poster_path, title, overview, 
            configuration, release_date} = film; 
            
            const spinner = loading ? <Spin size = "large" /> : null;
    const content = !loading ? <FilmCardView film = {film} /> : null */
    

    //({poster_path, title, overview, configuration, release_date, loading})