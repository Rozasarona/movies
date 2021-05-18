import { API_KEY, URLS } from './constants';

function prepareUrlWithApiKey(url) {
    const preparedUrl = new URL(url);
    preparedUrl.searchParams.append("api_key", API_KEY);
    return preparedUrl;
}

function addLanguageParameter(url) {
    url.searchParams.append("language", "en-US");
}

async function getJson(url, errorCallback) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        if (errorCallback) {
            errorCallback(error);
        }
    }
}

export async function createGuestSession(errorCallback) {
    const url = prepareUrlWithApiKey(URLS.CREATE_GUEST_SESSION);
    const result  = await getJson(url, errorCallback);
    return result.guest_session_id;
}

export async function getGuestSessionId(errorCallback) {
    const storageKey = 'guestSessionId';
    let guestSessionId = localStorage.getItem(storageKey);
    if (!guestSessionId) {
        guestSessionId = await createGuestSession(errorCallback);
        localStorage.setItem(storageKey, guestSessionId);
    }
    return guestSessionId;
}

export async function getConfiguration(errorCallback) {
    const url = prepareUrlWithApiKey(URLS.GET_CONFIGURATION);
    const result = await getJson(url, errorCallback);
    return result;
}

export async function getRatedMovies(guestSessionId, page) {
    const url = prepareUrlWithApiKey(URLS.GET_RATED_MOVIES(guestSessionId));
    addLanguageParameter(url);
    url.searchParams.append("page", page || 1);
    const result = await getJson(url);
    return result;
}

export async function rateMovie(movieId, guestSessionId, rating) {
    const url = prepareUrlWithApiKey(URLS.RATE_MOVIE(movieId));
    url.searchParams.append("guest_session_id", guestSessionId);
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({value: rating})
    })
    const result = await response.json();
    return result;
}

export async function getAllGenres(errorCallback) {
    const url = prepareUrlWithApiKey(URLS.GET_ALL_GENRES);
    addLanguageParameter(url);
    const result = await getJson(url, errorCallback);
    return result.genres;
}
