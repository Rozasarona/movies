import React from 'react';
import { Spin, Alert, Tabs, Pagination } from 'antd';

import { API_KEY } from '../../constants';
import { getGuestSessionId } from '../../commonFunctions';
import FilmList from '../FilmList/FilmList';
import Search from '../Search/Search';
import { GenresContext } from '../GenresContext';

import './App.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            films: [],
            filmsTotal: 0,
            loading: true,
            error: false,
            searchTerm: '',
            currentPage: 1,
            genres: [],
            guestSessionId: null,
            ratedFilms: []
        };
        this.setSearchValue = this.setSearchValue.bind(this);
        this.doSearch = this.doSearch.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.getAllGenres = this.getAllGenres.bind(this);
        this.tryRenderFilmListForSearch = this.tryRenderFilmListForSearch.bind(this);
        this.renderPlaceholder = this.renderPlaceholder.bind(this);
        this.tryRenderFilmListForRated = this.tryRenderFilmListForRated.bind(this);
    }

    onError = (err) => {
        this.setState({
            error: err,
            loading: false
        });
    }

    getAllGenres() {
        let url = new URL("https://api.themoviedb.org/3/genre/movie/list");
                url.searchParams.append("api_key", API_KEY);
                url.searchParams.append("language", "en-US");
                fetch(url)
                    .then(res => res.json())
                    .then((result) => {
                        this.setState({
                            genres: result.genres
                        });
                        console.log(result);
                    });
    }

    doSearch(searchTerm, page) {
        let url = new URL("https://api.themoviedb.org/3/search/movie");
                url.searchParams.append("api_key", API_KEY);
                url.searchParams.append("language", "en-US");
                url.searchParams.append("query", searchTerm);
                url.searchParams.append("page", page || 1);
                url.searchParams.append("include_adult", "false");
                fetch(url)
                    .then(res => res.json())
                    .then((result) => {
                        this.setState({
                            films: result.results || [],
                            filmsTotal: result.total_results,
                            loading: false,
                            searchTerm: searchTerm,
                            currentPage: result.page
                        });
                        console.log(result);
                    });
                    //throw 'Hello';
    }

    componentDidMount() {
        getGuestSessionId().then(guestSessionId => this.setState({guestSessionId: guestSessionId}));
        fetch(`https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`) 
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

            this.getAllGenres();
    }

    setSearchValue(searchValue) {
        this.doSearch(searchValue, 1);
    }

    onPageChange(page, pageSize) {
        this.doSearch(this.state.searchTerm, page);
    }

    tryRenderFilmListForSearch() {
        const { films, configuration, searchTerm } = this.state;

        if (films && films.length) {
            return (
            <FilmList
                films = { films }
                configuration = {configuration} />);
        } else {
            let message;
            if(searchTerm && searchTerm !== '') {
                message = (<>Nothing found by <b>{searchTerm}</b>.</>);
            } else {
                message = (<>Type something into search field...</>)
            }
            return this.renderPlaceholder(message);
        }
    }

    renderPlaceholder(message) {
        return (<div> {message} </div>);
    }

    tryRenderFilmListForRated() {
        const { ratedFilms, configuration } = this.state;

        if (ratedFilms && ratedFilms.length) {
            return (
                <FilmList
                    films = { ratedFilms }
                    configuration = {configuration} />);
        } else {
            return this.renderPlaceholder("You didn't rate any film yet...");
        }
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
        const content = hasData ? this.tryRenderFilmListForSearch() : null;
        const errorMess = error ? errorMessage(this.state.error) : null;
        const { TabPane } = Tabs;

        return(
            <div className="wrapper">
                {errorMess}
                {spinner}
                <Tabs defaultActiveKey="1" centered>
                    <TabPane tab="Search" key="1">
                        <div className="wrapper">
                            <Search onSearchTextChange = {this.setSearchValue} />
                            <GenresContext.Provider value={this.state.genres}>
                                {content}
                            </GenresContext.Provider>
                            <div className="paginationContainer">
                                <Pagination
                                    size="small"
                                    total={this.state.filmsTotal}
                                    defaultPageSize={20}
                                    current={this.state.currentPage}
                                    hideOnSinglePage={true}
                                    showSizeChanger={false}
                                    onChange={this.onPageChange} />
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="Rated" key="2">
                        {this.tryRenderFilmListForRated()}
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default App;


