import React from 'react';
import { Spin, Tabs } from 'antd';

import FilmList from '../FilmList/FilmList';
import Search from '../Search/Search';
import { GenresContext, ConfigurationContext } from '../ReactContexts';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

import Api from '../../Api'

import './App.css';

const { TabPane } = Tabs;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: '',
            films: [],
            filmsTotal: 0,
            currentPage: 1,
            loading: false,
            genres: [],
            guestSessionId: null,
            errorState: {
                message: null,
                description: null,
                visible: false
            },
            activeTab: "search",
            ratings: {}
        };

        this.api = new Api();
    }

    async componentDidMount() {
        const guestSessionId = await this.api.getGuestSessionId(this.onError);
        const configuration = await this.api.getConfiguration(this.onError);
        const genres = await this.api.getAllGenres(this.onError);

        this.setState({
            guestSessionId: guestSessionId,
            configuration: configuration,
            genres: genres
        });
    }

    doSearch = async page => {
        const { searchTerm, currentPage } = this.state;

        this.setState({
            films: [],
            filmsTotal: 0
        });

        if(!searchTerm || searchTerm === '' || searchTerm.trim() === '') return;

        this.setState({loading: true});

        const result = await this.api.searchMovies(searchTerm, page || currentPage, this.onError);
        const filmsWithRating = result.results || [];
        filmsWithRating.forEach(x => {
            if(this.state.ratings[x.id]) {
                x.rating = this.state.ratings[x.id];
            }
        });

        this.setState({
            loading: false,
            films: filmsWithRating,
            filmsTotal: result.total_results,
        });
    };

    loadRatedMovies = async page => {
        this.setState({loading: true,
            films: [],
        });

        const ratedMovies = await this.api.getRatedMovies(this.state.guestSessionId, page || this.state.currentPage);

        this.setState({
            loading: false,
            films: ratedMovies.results,
            filmsTotal: ratedMovies.total_results
        });
    };

    onError = err => {
        let message;
        let description;

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
    };

    setSearchTerm = searchValue => {
        this.setState({
            searchTerm: searchValue,
            currentPage: 1
        });
    };

    setCurrentPage = page => {
        this.setState({ currentPage: page });
    }

    onSearchTextChange = async searchValue => {
        this.setSearchTerm(searchValue);
        await this.doSearch();
    };

    onSearchTabPageChange = async page => {
        this.setCurrentPage(page);
        await this.doSearch(page);
    };

    onRatedTabPageChange = async page => {
        this.setCurrentPage(page);
        await this.loadRatedMovies(page);
    };

    onMovieRateChange = async (id, value) => {
        await this.api.rateMovie(id, this.state.guestSessionId, value);
        this.setState(oldState => {
            const newRatings = { ...oldState.ratings };
            newRatings[id] = value;
            return {
                ...oldState,
                films: oldState.films.map(film => film.id === id ? { ...film, rating: value } : film),
                ratings: newRatings
            };
        });
    };

    onTabChange = (activeKey) => {
        switch(activeKey) {
            case 'rated':
                this.loadRatedMovies();
                break;
            default:
                this.doSearch();
        }
        this.setState({ activeTab: activeKey });
    };

    renderTab = () => {
        const { activeTab, loading, films, searchTerm, filmsTotal, currentPage } = this.state;

        let placeholder;

        if(activeTab === 'search') {
            placeholder = (searchTerm && searchTerm !== '')
                ? (<div>Nothing found by <b>{searchTerm}</b>.</div>)
                : (<div>Type something into search field...</div>);
        } else {
            placeholder = (<div>You didn't rate any film yet...</div>);
        }

        const pageChangeHandler = activeTab === 'search' ? this.onSearchTabPageChange : this.onRatedTabPageChange;
        return (
            <div className="wrapper">
                {(activeTab === 'search') && <Search value={searchTerm} onSearchTextChange = {this.onSearchTextChange} />}
                {!loading && (<>
                    <FilmList
                        films={films}
                        onRateChange={this.onMovieRateChange}
                        filmsTotal={filmsTotal}
                        currentPage={currentPage}
                        pageChangeHandler={pageChangeHandler} />
                </>)}
                {!loading && (!films || !films.length) && placeholder}
            </div>
        );
    };

    render() {
        return (
            <div className="wrapper">
                <ErrorAlert
                    message={this.state.errorState.message}
                    description={this.state.errorState.description}
                    visible={this.state.errorState.visible} />
                <div className="spinContainer"><Spin size="large" spinning={this.state.loading} /></div>
                <GenresContext.Provider value={this.state.genres}>
                    <ConfigurationContext.Provider value={this.state.configuration}>
                        <header className="headerapp">
                            <Tabs defaultActiveKey="1" centered onChange={this.onTabChange}>
                                <TabPane tab="Search" key="search" />
                                <TabPane tab="Rated" key="rated" />
                            </Tabs>
                            {this.renderTab()}
                        </header>
                    </ConfigurationContext.Provider>
                </GenresContext.Provider>
            </div>
        );
    }
}



export default App;