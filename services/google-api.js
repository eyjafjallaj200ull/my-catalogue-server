const url = "https://www.googleapis.com/books/v1/";
const {GOOGLE_CONFIG} = require("../config/config");
const {clientSecret} = GOOGLE_CONFIG;
const fetch = require('node-fetch');

class GoogleApi {
    addVolume(shelfId, volumeId, accessToken) {
        return fetch(`${url}mylibrary/bookshelves/${shelfId}/addVolume?volumeId=${volumeId}&key=${clientSecret}`, {
            method: "POST",
            withCredentials: true,
            credentials: 'include',
            headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
            }
        })
    }
    fetchBookshelf(shelfId, accessToken) {
        return fetch(`${url}mylibrary/bookshelves/${shelfId}/volumes?key=${clientSecret}`, {
            method: "GET",
            withCredentials: true,
            credentials: 'include',
            headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
    }
    fetchLibrary(accessToken) {
        return fetch(`${url}mylibrary/bookshelves?key=${clientSecret}`, {
              method: "GET",
              withCredentials: true,
              credentials: 'include',
              headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
              }
            })
            .then(res => res.json())
    }
    fetchVolume(volumeId) {
        return fetch(`${url}volumes/${volumeId}`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json"
                }
            })
            .then(res => res.json())
    }
    removeVolume(shelfId, volumeId, accessToken) {
        return fetch(`${url}mylibrary/bookshelves/${shelfId}/removeVolume?volumeId=${volumeId}&key=${clientSecret}`, {
            method: "POST",
            withCredentials: true,
            credentials: 'include',
            headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
            }
        })
    }
}

module.exports = new GoogleApi()