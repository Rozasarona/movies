import React from 'react';
//import ReactDOM from 'react-dom';
import './App.css';
import FilmList from '../FilmList/FilmList'
import { Spin } from 'antd';
import { Alert } from 'antd';



class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            films: [],
            loading: true,
            error: false
           
        };
    }

    onError = (err) => {
        this.setState({
            error: true,
            loading: false
        })
    }


    componentDidMount() {
        debugger;
        fetch("https://api.themoviedb.org/3/configuration?api_key=2174bad4d702278c7b79c6172f192382") 
            .then(response => response.json())
            .then((result) => {
                this.setState({
                    configuration: result
                });
            
            })
            
            .then(() => {
                fetch("https://api.themoviedb.org/3/search/movie?api_key=2174bad4d702278c7b79c6172f192382&language=en-US&query=return&page=1&include_adult=false")
                    .then(res => res.json())
                    .then((result) => {
                        this.setState({
                            films: result.results,
                            loading: false
                        });
                        console.log(result);                        
                    }); 
                    throw 'Hello';
            }) 
            .catch(this.onError);                       
    }
    
    render()  {    
        
        const loading = this.state.loading;
        const error = this.state.error;
        const hasData = !(loading || error);
        const errorMessage = error ? <Alert
                                        message="Error"
                                        description="Ooops! Something went wrong"
                                        type="error"
                                        showIcon
                                    /> : null;
        const spinner = (loading) ? <div className="spinContainer"><Spin size="large" /></div> : null;
        const content = hasData ? <FilmList 
                                       films = { this.state.films }
                                       configuration = {this.state.configuration}/> : null;


        return(
            <div className="wrapper"> 
                {errorMessage}
                {spinner}
                {content}
            </div>   
        )    
    }
}

export default App;