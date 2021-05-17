import { API_KEY } from './constants';

export async function createGuestSession() {
    let url = new URL("https://api.themoviedb.org/3/authentication/guest_session/new");
        url.searchParams.append("api_key", API_KEY);
    const res = await fetch(url);
    const result  = await res.json();
    return result.guest_session_id;
}

export async function getGuestSessionId() {
    const storageKey = 'guestSessionId';
    let guestSessionId = localStorage.getItem(storageKey);
    if (!guestSessionId) {
        guestSessionId = await createGuestSession();
        localStorage.setItem(storageKey, guestSessionId);
    }
    return guestSessionId;
}