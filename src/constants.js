export const API_KEY = "2174bad4d702278c7b79c6172f192382";
const BASE_URL = "https://api.themoviedb.org/3";
export const URLS = {
    CREATE_GUEST_SESSION: `${BASE_URL}/authentication/guest_session/new`,
    GET_CONFIGURATION: `${BASE_URL}/configuration`,
    GET_RATED_MOVIES: (guest_session_id) => `${BASE_URL}/guest_session/${guest_session_id}/rated/movies`,
    RATE_MOVIE: (movie_id) => `${BASE_URL}/movie/${movie_id}/rating`,
    GET_ALL_GENRES: `${BASE_URL}/genre/movie/list`
};
