import React from 'react';
import ReactDOM from 'react-dom';

class Api {
    API_KEY = "2174bad4d702278c7b79c6172f192382";
    BASE_URL = "https://api.themoviedb.org/3";
    URLS = {
        CREATE_GUEST_SESSION: `${this.BASE_URL}/authentication/guest_session/new`,
        GET_CONFIGURATION: `${this.BASE_URL}/configuration`,
        GET_RATED_MOVIES: (guest_session_id) => `${this.BASE_URL}/guest_session/${guest_session_id}/rated/movies`,
        RATE_MOVIE: (movie_id) => `${this.BASE_URL}/movie/${movie_id}/rating`,
        GET_ALL_GENRES: `${this.BASE_URL}/genre/movie/list`,
        SEARCH_MOVIES: `${this.BASE_URL}/search/movie`
    };

    addParameters(url, params) {
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    prepareUrlWithApiKey(url) {
        const preparedUrl = new URL(url);
        this.addParameters(preparedUrl, { api_key: this.API_KEY });
        return preparedUrl;
    }

    addLanguageParameter(url) {
        this.addParameters(url, { language: "en-US" });
    }

    async tryCatch(tryFn, catchFn) {
        try {
            await tryFn();
        } catch(error) {
            if(catchFn) catchFn(error);
            else throw error;
        }
    }

    async getJson(url, errorCallback) {
        let result;
        await this.tryCatch(async () => {
            const response = await fetch(url);
            result = await response.json();
        }, errorCallback);
        return result;
    }

    async postJson(url, payload, errorCallback) {
        let result;
        await this.tryCatch(async () => {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                body: JSON.stringify(payload)
            });
            result = await response.json();
        }, errorCallback);
        return result;
    }

    async createGuestSession(errorCallback) {
        const url = this.prepareUrlWithApiKey(this.URLS.CREATE_GUEST_SESSION);
        const result  = await this.getJson(url, errorCallback);
        return result.guest_session_id;
    }

    async getGuestSessionId(errorCallback) {
        const storageKey = 'guestSessionId';
        let guestSessionId = localStorage.getItem(storageKey);
        if (!guestSessionId) {
            guestSessionId = await this.createGuestSession(errorCallback);
            localStorage.setItem(storageKey, guestSessionId);
        }
        return guestSessionId;
    }

    async getConfiguration(errorCallback) {
        const url = this.prepareUrlWithApiKey(this.URLS.GET_CONFIGURATION);
        const result = await this.getJson(url, errorCallback);
        return result;
    }

    async getRatedMovies(guestSessionId, page) {
        const url = this.prepareUrlWithApiKey(this.URLS.GET_RATED_MOVIES(guestSessionId));
        this.addParameters(url, {
            language: "en-US",
            page: page || 1
        });
        const result = await this.getJson(url);
        return result;
    }

    async rateMovie(movieId, guestSessionId, rating, errorCallback) {
        const url = this.prepareUrlWithApiKey(this.URLS.RATE_MOVIE(movieId));
        this.addParameters(url, { guest_session_id: guestSessionId });
        return await this.postJson(url, { value: rating }, errorCallback);
    }

    async getAllGenres(errorCallback) {
        const url = this.prepareUrlWithApiKey(this.URLS.GET_ALL_GENRES);
        this.addLanguageParameter(url);
        const result = await this.getJson(url, errorCallback);
        return result.genres;
    }

    async searchMovies(searchTerm, page, errorCallback) {
        const url = this.prepareUrlWithApiKey(this.URLS.SEARCH_MOVIES);
        this.addParameters(url, {
            language: "en-US",
            query: searchTerm,
            page: page || 1,
            include_adult: false
        });
        return await this.getJson(url, errorCallback);
    }
}




export default Api;