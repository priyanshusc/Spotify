import axios from 'axios';

// Create an axios instance to avoid repeating configuration
const API = axios.create({
    baseURL: 'http://localhost:3000/api/playlist',
    withCredentials: true, // Crucial: This sends the cookie with the request
});

export const playlistService = {
    // GET /api/playlists
    getAll: async () => {
        const response = await API.get('/my-playlists');
        return response.data;
    },

    // POST /api/playlists
    create: async (name, description, thumbnail) => {
        const response = await API.post('/create', { name, description, thumbnail });
        return response.data;
    },

    // GET /api/playlists/:playlistId
    getById: async (playlistId) => {
        const response = await API.get(`/${playlistId}`);
        return response.data;
    },

    // DELETE /api/playlists/:playlistId
    delete: async (playlistId) => {
        const response = await API.delete(`/${playlistId}`);
        return response.data;
    },

    // POST /api/playlists/:playlistId/add
    addSong: async (playlistId, songId) => {
        const response = await API.post(`/add-song/${playlistId}`, { songId });
        return response.data;
    },

    // DELETE /api/playlists/:playlistId/remove
    removeSong: async (playlistId, songId) => {
        // Axios delete requires the 'data' key for request bodies
        const response = await API.patch(`/remove-song/${playlistId}`, { songId });
        return response.data;
    },

    update: async (playlistId, updateData) => {
        // updateData will be { name, description, thumbnail }
        const response = await API.put(`/edit/${playlistId}`, updateData);
        return response.data;
    },
};