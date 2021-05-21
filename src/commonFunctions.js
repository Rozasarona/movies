import { API_KEY, URLS } from './constants';

function addParameters(url, params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
}

function prepareUrlWithApiKey(url) {
    const preparedUrl = new URL(url);
    addParameters(preparedUrl, { api_key: API_KEY });
    return preparedUrl;
}

function addLanguageParameter(url) {
    addParameters(url, { language: "en-US" });
}

async function tryCatch(tryFn, catchFn) {
    try {
        await tryFn();
    } catch(error) {
        if(catchFn) catchFn(error);
        else throw error;
    }
}

async function getJson(url, errorCallback) {
    let result;
    await tryCatch(async () => {
        const response = await fetch(url);
        result = await response.json();
    }, errorCallback);
    return result;
}

async function postJson(url, payload, errorCallback) {
    let result;
    await tryCatch(async () => {
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
    addParameters(url, {
        language: "en-US",
        page: page || 1
    });
    const result = await getJson(url);
    return result;
}

export async function rateMovie(movieId, guestSessionId, rating, errorCallback) {
    const url = prepareUrlWithApiKey(URLS.RATE_MOVIE(movieId));
    addParameters(url, { guest_session_id: guestSessionId });
    return await postJson(url, { value: rating }, errorCallback);
}

export async function getAllGenres(errorCallback) {
    const url = prepareUrlWithApiKey(URLS.GET_ALL_GENRES);
    addLanguageParameter(url);
    const result = await getJson(url, errorCallback);
    return result.genres;
}

export async function searchMovies(searchTerm, page, errorCallback) {
    const url = prepareUrlWithApiKey(URLS.SEARCH_MOVIES);
    addParameters(url, {
        language: "en-US",
        query: searchTerm,
        page: page || 1,
        include_adult: false
    });
    return await getJson(url, errorCallback);
}
