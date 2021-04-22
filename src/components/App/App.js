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
            error: false,
        };
        this.setSearchValue = this.setSearchValue.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }

    onError = (err) => {
        this.setState({
            error: err,
            loading: false
        });
    }

    doSearch(searchTerm) {
        let url = new URL("https://api.themoviedb.org/3/search/movie");
                url.searchParams.append("api_key", "2174bad4d702278c7b79c6172f192382");
                url.searchParams.append("language", "en-US");
                url.searchParams.append("query", searchTerm);
                url.searchParams.append("page", "1");
                url.searchParams.append("include_adult", "false");
                fetch(url)
                    .then(res => res.json())
                    .then((result) => {
                        this.setState({
                            films: result.results || [],
                            loading: false
                        });
                        console.log(result);
                    });
                    //throw 'Hello';
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
                this.doSearch('');
            })
            .catch(this.onError);
    }

    setSearchValue(searchValue) {
        this.doSearch(searchValue);
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
                <Search onSearchTextChange = {this.setSearchValue} />
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


