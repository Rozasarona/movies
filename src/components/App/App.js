import React from 'react';
import { Spin, Tabs, Pagination } from 'antd';

import FilmList from '../FilmList/FilmList';
import Search from '../Search/Search';
import { GenresContext, ConfigurationContext } from '../ReactContexts';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

import * as commonFunctions from '../../commonFunctions';

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
            }
        };
    }

    async componentDidMount() {
        const guestSessionId = await commonFunctions.getGuestSessionId(this.onError);
        const configuration = await commonFunctions.getConfiguration(this.onError);
        const genres = await commonFunctions.getAllGenres(this.onError);

        this.setState({
            guestSessionId: guestSessionId,
            configuration: configuration,
            genres: genres
        });
    }

    doSearch = async (searchTerm, page) => {
        if(!searchTerm || searchTerm === '') return;

        this.setState({loading: true});

        const result = await commonFunctions.searchMovies(searchTerm, page, this.onError);

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

        const ratedMovies = await commonFunctions.getRatedMovies(this.state.guestSessionId, page);

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

    onPageChange = page => this.doSearch(this.state.searchTabState.searchTerm, page);

    onRatedPageChange = page => this.loadRatedMovies(page);

    onMovieRateChange = async (id, value) => await commonFunctions.rateMovie(id, this.state.guestSessionId, value);

    onTabChange = (activeKey) => {
        if(activeKey === 'rated') {
            this.loadRatedMovies();
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
                        onChange={this.onPageChange} />
                </div>
            </>);
        } else {
            let message;
            if(searchTerm && searchTerm !== '') {
                message = (<>Nothing found by <b>{searchTerm}</b>.</>);
            } else {
                message = "Type something into search field...";
            }
            return this.renderPlaceholder(message);
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
                        onChange={this.onRatedPageChange} />
                </div>
            </>);
        } else {
            return this.renderPlaceholder("You didn't rate any film yet...");
        }
    };

    renderPlaceholder = (message) => (<div> {message} </div>);

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
                            <TabPane tab="Search" key="search">
                                <div className="wrapper">
                                    <Search onSearchTextChange = {this.onSearchTextChange} />
                                    {this.tryRenderFilmListForSearch()}
                                </div>
                            </TabPane>
                            <TabPane tab="Rated" key="rated">
                                <div className="wrapper">
                                    {this.tryRenderFilmListForRated()}
                                </div>
                            </TabPane>
                        </Tabs>
                    </ConfigurationContext.Provider>
                </GenresContext.Provider>
            </div>
        );
    }
}

export default App;
