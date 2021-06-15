import React from 'react';
import { Spin, Tabs, Pagination } from 'antd';

import FilmList from '../FilmList/FilmList';
import Search from '../Search/Search';
import { GenresContext, ConfigurationContext } from '../ReactContexts';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

import Api from '../../Api'

//import * as commonFunctions from '../../commonFunctions';

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
            errorState: {
                message: null,
                description: null,
                visible: false
            },
            activeTab: "search"
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

    doSearch = async (searchTerm, page) => {
        if(!searchTerm || searchTerm === '' || searchTerm.trim() === '') return;

        this.setState({loading: true});

        const result = await this.api.searchMovies(searchTerm, page, this.onError);

        this.setState({
            loading: false,
            searchTabState: {
                searchTerm: searchTerm,
                films: result.results || [],
                filmsTotal: result.total_results,
                currentPage: result.page
            }
        });
        console.log(result);
    };

    loadRatedMovies = async page => {
        this.setState({loading: true});

        const ratedMovies = await this.api.getRatedMovies(this.state.guestSessionId, page);

        this.setState({
            loading: false,
            ratedTabState: {
                films: ratedMovies.results,
                currentPage: ratedMovies.page,
                filmsTotal: ratedMovies.total_results
            }
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

    onSearchTextChange = searchValue => this.doSearch(searchValue, 1);

    onMovieRateChange = async (id, value) => {
        await this.api.rateMovie(id, this.state.guestSessionId, value);
        this.setState(oldState => {
            return {
                ...oldState,
                searchTabState: {
                    ...oldState.searchTabState,
                    films: oldState.searchTabState.films.map(film => film.id === id ? { ...film, rating: value } : film)
                }
            };
        });
    };

    onTabChange = (activeKey) => {
        if(activeKey === 'rated') {
            this.loadRatedMovies();
        }
        this.setState({ activeTab: activeKey });
    };

    renderTab = () => {
        switch(this.state.activeTab) {
            case "search":
                return (
                    <div className="wrapper">
                        <Search onSearchTextChange = {this.onSearchTextChange} />
                        {this.tryRenderFilmListForSearch()}
                    </div>
                );
            case "rated":
                return (
                    <div className="wrapper">
                        {this.tryRenderFilmListForRated()}
                    </div>
                );
            default:
                return null;
        }
    };

    tryRenderFilmListForSearch = () => {
        const { loading, searchTabState } = this.state;
        const { films, searchTerm, filmsTotal, currentPage } = searchTabState;

        if (loading) return null;

        if (films && films.length) {
            return (<>
                <FilmList
                    films={films}
                    onRateChange={this.onMovieRateChange} />
                <div className="paginationContainer">
                    <Pagination
                        size="small"
                        total={filmsTotal}
                        defaultPageSize={20}
                        current={currentPage}
                        hideOnSinglePage={true}
                        showSizeChanger={false}
                        onChange={page => this.doSearch(this.state.searchTabState.searchTerm, page)} />
                </div>
            </>);
        } else {
            let message;
            if(searchTerm && searchTerm !== '') {
                message = (<>Nothing found by <b>{searchTerm}</b>.</>);
            } else {
                message = "Type something into search field...";
            }
            return <div>{ message }</div>;
        }
    };

    tryRenderFilmListForRated = () => {
        const { loading, ratedTabState } = this.state;
        const { films, filmsTotal, currentPage } = ratedTabState;

        if (loading) return null;

        if (films && films.length) {
            return (<>
                <FilmList
                    films={films}
                    onRateChange={this.onMovieRateChange} />
                <div className="paginationContainer">
                    <Pagination
                        size="small"
                        total={filmsTotal}
                        defaultPageSize={20}
                        current={currentPage}
                        hideOnSinglePage={true}
                        showSizeChanger={false}
                        onChange={this.loadRatedMovies} />
                </div>
            </>);
        } else {
            return <div>"You didn't rate any film yet..."</div>;
        }
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
                        <Tabs defaultActiveKey="1" centered onChange={this.onTabChange}>
                            <TabPane tab="Search" key="search" />
                            <TabPane tab="Rated" key="rated" />
                        </Tabs>
                        {this.renderTab()}
                    </ConfigurationContext.Provider>
                </GenresContext.Provider>
            </div>
        );
    }
}



export default App;
