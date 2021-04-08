import React from 'react';
//import ReactDOM from 'react-dom';
import './App.css';
import FilmList from '../FilmList/FilmList';
import Search from '../Search/Search'; 
import { Spin } from 'antd';
import { Alert } from 'antd';

import { Tabs } from 'antd';
import { Pagination } from 'antd';





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
            error: err,
            loading: false
        });
    }

    
    componentDidMount() {
        
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
                    //throw 'Hello';
            }) 
            .catch(this.onError);                       
    }
    
    render()  {    
        
        const loading = this.state.loading;
        const error = this.state.error;
        const hasData = !(loading || error);

        const errorMessage = (err) => {
            if(err.message === 'Failed to fetch') {
                return(
                    <Alert
                        message="Error"
                        description="Ooops! Network problem"
                        type="error"
                        showIcon
                    /> 
                )
            } else {
                return(
                    <Alert
                        message="Error"
                        description="Ooops! Something went wrong"
                        type="error"
                        showIcon
                    /> 
                )
            }
        }

        const spinner = loading ? <div className="spinContainer"><Spin size="large" /></div> : null;
        const content = hasData ? <FilmList 
                                       films = { this.state.films }
                                       configuration = {this.state.configuration}/> : null;
        const errorMess = error ? errorMessage(this.state.error) : null;
        const { TabPane } = Tabs;

        return(
            <div className="wrapper"> 
               <Tabs defaultActiveKey="1" centered>
                    <TabPane tab="Search" key="1" />                 
                    <TabPane tab="Rated" key="2" />                    
                </Tabs>
                <Search />
                {errorMess}
                {spinner}
                {content}
                <div className="paginationContainer">
                    <Pagination size="small" total={50} />    
                </div> 
            </div>   
        )    
    }
}

export default App;


