// context/PlaylistContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { playlistService } from '../services/playlist.service';
import { useAuth } from './AuthContext';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);

    const refreshPlaylists = async () => {
        // If no user is logged in, empty the playlists and stop
        if (!user) {
            setPlaylists([]);
            return;
        }

        try {
            const res = await playlistService.getAll();
            if (res.success) {
                setPlaylists(res.data);
            }
        } catch (err) {
            if (err.response?.status !== 401) {
                console.error("Error fetching playlists", err);
            }
        }
    };

    // Fetch playlists automatically whenever the user logs in or out
    useEffect(() => {
        refreshPlaylists();
    }, [user]);

    return (
        <PlaylistContext.Provider value={{ playlists, refreshPlaylists }}>
            {children}
        </PlaylistContext.Provider>
    );
};

// Custom hook to use the context easily in any file
export const usePlaylists = () => useContext(PlaylistContext);