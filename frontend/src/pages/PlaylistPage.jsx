// pages/PlaylistPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playlistService } from '../services/playlist.service';
import PlaylistImage from '../components/PlaylistImage';
import SongMenu from '../components/SongMenu'; // 👈 Import Menu
import { usePlaylists } from '../context/PlaylistContext';
import { Pencil, Trash2, Play, Clock } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext'
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const PlaylistPage = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();

    const { setQueue, playSong, currentSong, isPlaying } = usePlayer();

    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const { refreshPlaylists } = usePlaylists(); // 👈 For updating the sidebar count
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handlePlaylistUpdated = (updatedPlaylist) => {
        setPlaylist(prev => ({
            ...prev,
            // Only update the metadata, LEAVE 'musics' ALONE!
            name: updatedPlaylist.name,
            description: updatedPlaylist.description,
            thumbnail: updatedPlaylist.thumbnail
        }));
        refreshPlaylists();
    };

    const fetchDetails = async () => {
        try {
            const res = await playlistService.getById(playlistId);
            setPlaylist(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch playlist");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [playlistId]);

    useEffect(() => {
        if (playlist?.musics) {
            setQueue(playlist.musics);
        }
    }, [playlist, setQueue]);

    const handleDeletePlaylist = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this playlist? This cannot be undone.");

        if (confirmDelete) {
            try {
                const res = await playlistService.delete(playlistId);
                if (res.success) {
                    refreshPlaylists(); // Update Sidebar instantly
                    toast.success('Playlist deleted successfully!');
                    navigate('/'); // Send user back to Home
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to delete playlist");
            }
        }
    };

    const handleRemoveFromPlaylist = async (e, songId) => {
        e.stopPropagation();
        try {
            const res = await playlistService.removeSong(playlistId, songId);
            if (res.success) {
                // Optimistically update the UI so the song disappears instantly
                setPlaylist(prev => ({
                    ...prev,
                    musics: prev.musics.filter(m => m._id !== songId)
                }));
                // Update the sidebar count
                refreshPlaylists();
                toast.success('Song removed from playlist!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove song");
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!playlist) return <div className="p-8 text-white">Playlist not found.</div>;

    return (
        <div className="flex-1 bg-gradient-to-b from-[#404040] to-spotify-black overflow-y-auto p-8 min-h-full -mt-6 -mx-6">
            <div className="flex items-end gap-6 mb-8 p-8 relative group/header">
                {/* Clickable Image to Edit (The Spotify Way) */}
                <div
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-52 h-52 rounded overflow-hidden shadow-2xl shrink-0 cursor-pointer group/img relative"
                >
                    <PlaylistImage src={playlist.thumbnail} name={playlist.name} size={80} />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                        <Pencil size={40} className="text-white" />
                    </div>
                </div>

                <div className="flex-1">
                    <p className="text-sm font-bold text-white uppercase tracking-wider">Playlist</p>
                    {/* Pencil icon next to Title */}
                    <div className="flex items-center gap-4">
                        <h1
                            onClick={() => setIsEditModalOpen(true)}
                            className="text-8xl font-black text-white mt-2 mb-6 cursor-pointer hover:underline underline-offset-8"
                        >
                            {playlist.name}
                        </h1>
                    </div>
                    <p className="text-gray-400">{playlist.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-white text-sm font-bold hover:underline cursor-pointer">
                            {user?.username || "Admin"}
                        </span>
                        <span className="text-gray-400 text-sm">• {playlist.musics?.length || 0} songs</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8 px-8 pb-6">
                {/* Main Play Button */}
                <button
                    onClick={() => playlist.musics.length > 0 && playSong(playlist.musics[0])}
                    className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg active:scale-95"
                >
                    <Play fill="black" className="text-black ml-1" size={28} />
                </button>

                {/* Subdued Delete Button */}
                <button
                    onClick={handleDeletePlaylist}
                    className="group flex items-center justify-center w-10 h-10 rounded-full border border-gray-500 hover:border-red-500 transition-colors"
                    title="Delete Playlist"
                >
                    <Trash2 size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>
            </div>

            <div className="px-8 pb-20">
                <div className="grid grid-cols-[16px_4fr_3fr_120px] gap-4 px-4 py-2 text-gray-400 border-b border-white/10 mb-4 text-sm">
                    <span>#</span>
                    <span>Title</span>
                    <span>Artist</span>
                    <span className="flex justify-end pr-8"><Clock size={16} /></span>
                </div>

                {playlist.musics.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-gray-500 italic">This playlist is empty. Start adding some tracks!</p>
                    </div>
                ) : (
                    playlist.musics.map((song, index) => (
                        <div
                            key={song._id}
                            onClick={() => playSong(song)} // 👈 4. Play song on click
                            className={`grid grid-cols-[16px_4fr_3fr_120px] gap-4 px-4 py-2 rounded-md hover:bg-white/10 transition group cursor-pointer items-center relative
                                ${currentSong?._id === song._id ? 'text-spotify-green' : 'text-spotify-text-muted'}`}
                        >
                            {/* Index / Speaker Icon */}
                            <span className="text-sm">
                                {currentSong?._id === song._id && isPlaying ? (
                                    <div className="w-3 h-3 bg-spotify-green animate-pulse rounded-full" />
                                ) : (
                                    index + 1
                                )}
                            </span>

                            {/* Title and Thumbnail */}
                            <div className="flex items-center gap-3 overflow-hidden">
                                <img src={song.thumbnail_uri} className="w-10 h-10 rounded shadow-md" alt="" />
                                <span className={`font-medium truncate ${currentSong?._id === song._id ? 'text-spotify-green' : 'text-white'}`}>
                                    {song.title}
                                </span>
                            </div>

                            {/* Artist */}
                            <span className="truncate group-hover:text-white transition-colors">{song.artist?.username}</span>

                            {/* Duration & Menu */}
                            <div className="flex justify-end items-center gap-4 relative">
                                <span className="text-sm w-10 text-right">3:45</span>
                                <SongMenu
                                    song={song}
                                    context="playlist"
                                    onRemoveFromPlaylist={handleRemoveFromPlaylist}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
            <CreatePlaylistModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onPlaylistUpdated={handlePlaylistUpdated}
                initialData={playlist} // This triggers the "Edit Mode"
            />
        </div>
    );
};

export default PlaylistPage;