import React from 'react';
import { Spin, Tabs, Pagination } from 'antd';

import { API_KEY } from '../../constants';
import * as commonFunctions from '../../commonFunctions';
import FilmList from '../FilmList/FilmList';
import Search from '../Search/Search';
import GenresContext from '../GenresContext';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

import './App.css';

const { TabPane } = Tabs;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchTabState: {
                searchTerm: '',
                films: [],
                filmsTotal: 0,
                currentPage: 1
            },
            ratedTabState: {
                films: [],
                filmsTotal: 0,
                currentPage: 1
            },
            loading: false,
            genres: [],
            guestSessionId: null,
            ratedFilms: [],
            errorState: {
                message: null,
                description: null,
                visible: false
            }
        };
        this.setSearchValue = this.setSearchValue.bind(this);
        this.doSearch = this.doSearch.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.tryRenderFilmListForSearch = this.tryRenderFilmListForSearch.bind(this);
        this.renderPlaceholder = this.renderPlaceholder.bind(this);
        this.tryRenderFilmListForRated = this.tryRenderFilmListForRated.bind(this);
    }

    onError = (err) => {
        let message = "Oops!";
        let description = "Something went wrong...";
        if(err.message === 'Failed to fetch') {
            message = "Error";
            description = "Ooops! Network problem";
        } else {
            message = "Error";
            description = "Ooops! Something went wrong";
        }

        this.setState({
            errorState: {
                message: message,
                description: description,
                visible: true
            },
            loading: false
        });
    }

    doSearch(searchTerm, page) {
        if(!searchTerm || searchTerm === '') return;
        this.setState({loading: true});
        let url = new URL("https://api.themoviedb.org/3/search/movie");
                url.searchParams.append("api_key", API_KEY);
                url.searchParams.append("language", "en-US");
                url.searchParams.append("query", searchTerm);
                url.searchParams.append("page", page || 1);
                url.searchParams.append("include_adult", "false");
                fetch(url)
                    .then(res => res.json())
                    .then((result) => {
                        this.setState(oldState => ({
                            searchTabState: {
                                ...oldState.searchTabState,
                                searchTerm: searchTerm,
                                films: result.results || [],
                                filmsTotal: result.total_results,
                                currentPage: result.page
                            },
                            loading: false,
                        }));
                    })
                    .catch(this.onError);
    }

    async componentDidMount() {
        const guestSessionId = await commonFunctions.getGuestSessionId();
        this.setState({guestSessionId: guestSessionId});

        const configuration = await commonFunctions.getConfiguration(this.onError);
        this.setState({configuration: configuration});

        // fetch(`https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`) 
        //     .then(response => response.json())
        //     .then((result) => {
        //         this.setState({
        //             configuration: result
        //         });
        //     })
        //     .catch(this.onError);

        const genres = await commonFunctions.getAllGenres(this.onError);
        this.setState({genres: genres});
    }

    setSearchValue(searchValue) {
        this.doSearch(searchValue, 1);
    }

    onPageChange(page, pageSize) {
        this.doSearch(this.state.searchTabState.searchTerm, page);
    }

    onRatedPageChange = (page, pageSize) => {
        this.loadRatedMovies(page);
    }

    tryRenderFilmListForSearch() {
        const { searchTabState, configuration } = this.state;
        const { films, searchTerm } = searchTabState;

        if (films && films.length) {
            return (
            <FilmList
                films = { films }
                configuration = {configuration}
                onRateChange = {this.onMovieRateChange} />);
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

    onMovieRateChange = async (id, value) => {
        await commonFunctions.rateMovie(id, this.state.guestSessionId, value);
    };

    renderPlaceholder(message) {
        return (<div> {message} </div>);
    }

    tryRenderFilmListForRated() {
        const { ratedTabState, configuration } = this.state;
        const { films } = ratedTabState;

        if (films && films.length) {
            return (
                <FilmList
                    films = { films }
                    configuration = {configuration}
                    onRateChange = {this.onMovieRateChange} />);
        } else {
            return this.renderPlaceholder("You didn't rate any film yet...");
        }
    }

    onTabChange = (activeKey) => {
        if(activeKey === 'rated') {
            this.loadRatedMovies();
        }
    };

    loadRatedMovies = async (page) => {
        this.setState({loading: true});
        const ratedMovies = await commonFunctions.getRatedMovies(this.state.guestSessionId, page);
        this.setState(oldState => ({
            loading: false,
            ratedTabState: {
                films: ratedMovies.results,
                currentPage: ratedMovies.page,
                filmsTotal: ratedMovies.total_results
        }}));
    };

    render()  {
        const loading = this.state.loading;

        const content = !loading ? this.tryRenderFilmListForSearch() : null;

        return(
            <div className="wrapper">
                <ErrorAlert
                    message={this.state.errorState.message}
                    description={this.state.errorState.description}
                    visible={this.state.errorState.visible} />
                <div className="spinContainer"><Spin size="large" spinning={this.state.loading} /></div>
                <GenresContext.Provider value={this.state.genres}>
                    <Tabs defaultActiveKey="1" centered onChange={this.onTabChange}>
                        <TabPane tab="Search" key="search">
                            <div className="wrapper">
                                <Search onSearchTextChange = {this.setSearchValue} />
                                {content}
                                <div className="paginationContainer">
                                    <Pagination
                                        size="small"
                                        total={this.state.searchTabState.filmsTotal}
                                        defaultPageSize={20}
                                        current={this.state.searchTabState.currentPage}
                                        hideOnSinglePage={true}
                                        showSizeChanger={false}
                                        onChange={this.onPageChange} />
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Rated" key="rated">
                            <div className="wrapper">
                                {this.tryRenderFilmListForRated()}
                                <div className="paginationContainer">
                                    <Pagination
                                        size="small"
                                        total={this.state.ratedTabState.filmsTotal}
                                        defaultPageSize={20}
                                        current={this.state.ratedTabState.currentPage}
                                        hideOnSinglePage={true}
                                        showSizeChanger={false}
                                        onChange={this.onRatedPageChange} />
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </GenresContext.Provider>
            </div>
        )
    }
}

export default App;


