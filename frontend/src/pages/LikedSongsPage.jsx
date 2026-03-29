import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Clock, Heart, Play } from 'lucide-react';
import api from '../api/api';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { usePlaylists } from '../context/PlaylistContext';
import { playlistService } from '../services/playlist.service';
import SongMenu from '../components/SongMenu';
import { toast } from 'sonner';

const LikedSongsPage = () => {

    const queryClient = useQueryClient();
    const { setQueue, playSong, currentSong, isPlaying } = usePlayer();
    const { user } = useAuth();
    const { playlists, refreshPlaylists } = usePlaylists();

    const { data: songs, isLoading } = useQuery({
        queryKey: ['likedSongs'],
        queryFn: async () => {
            const res = await api.get('/user/liked-songs');
            return res.data.data;
        },
    });

    const handleRemoveLike = async (e, songId) => {
        e.stopPropagation();
        try {
            const res = await api.post(`/music/togglelike/${songId}`);
            if (res.status === 200) {
                queryClient.invalidateQueries({ queryKey: ['likedSongs'] });
                queryClient.invalidateQueries({ queryKey: ['allSongs'] });

                toast.success('Song unliked successfully!');
            }
        } catch (err) {
            toast.error('Failed to remove like');
        }
    };

    useEffect(() => {
        if (songs) {
            setQueue(songs);
        }
    }, [songs, setQueue]);

    const handleAddToPlaylist = async (e, playlistId, songId) => {
        e.stopPropagation();
        try {
            const res = await playlistService.addSong(playlistId, songId);
            if (res.success) {
                refreshPlaylists();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add song");
        }
    };

    if (isLoading) return <div className="p-8 text-white">Loading your library...</div>;

    return (
        <div className="min-h-full bg-gradient-to-b from-[#5038a0] to-[#121212] -mt-6 -mx-6">

            {/* --- Hero Header Section --- */}
            <div className="flex items-end gap-6 p-8 h-60 md:h-80 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.5)]">
                <div className="bg-gradient-to-br from-[#450af5] to-[#c4efd9] w-40 h-40 md:w-36 md:h-36 shadow-2xl flex items-center justify-center rounded-sm">
                    <Heart size={80} fill="white" className="text-white" />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-white uppercase">Playlist</span>
                    <h1 className="text-5xl md:text-7xl font-black text-white">Liked Songs</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <img src={user?.profilePicture} className="w-6 h-6 rounded-full" alt="user" />
                        <span className="text-white text-sm font-bold hover:underline cursor-pointer">{user?.username}</span>
                        <span className="text-white text-sm">• {songs?.length} songs</span>
                    </div>
                </div>
            </div>

            {/* --- Action Bar --- */}
            <div className="p-8">
                <button
                    onClick={() => songs?.length > 0 && playSong(songs[0])}
                    className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg active:scale-95"
                >
                    <Play fill="black" className="text-black ml-1" size={28} />
                </button>
            </div>

            {/* --- The Song List --- */}
            <div className="px-8 pb-20">
                <div className="grid grid-cols-[16px_4fr_3fr_120px] gap-4 px-4 py-2 border-b border-white/10 text-spotify-text-muted text-sm font-medium mb-4">
                    <span>#</span>
                    <span>Title</span>
                    <span className="hidden md:block">Artist</span>
                    <span className="flex justify-end pr-8"><Clock size={16} /></span>
                </div>

                {songs?.length === 0 ? (
                    <div className="py-10 text-center text-gray-400">
                        Songs you like will appear here. Start hearting!
                    </div>
                ) : (
                    songs.map((song, index) => (
                        <div
                            key={song._id}
                            onClick={() => playSong(song)}
                            className={`grid grid-cols-[16px_4fr_3fr_120px] gap-4 px-4 py-2 rounded-md hover:bg-white/10 transition group cursor-pointer items-center relative
                                ${currentSong?._id === song._id ? 'text-spotify-green' : 'text-white'}`}
                        >
                            <span className="text-sm text-spotify-text-muted">
                                {currentSong?._id === song._id && isPlaying ? (
                                    <div className="w-3 h-3 bg-spotify-green animate-pulse rounded-full" />
                                ) : index + 1}
                            </span>

                            <div className="flex items-center gap-4 overflow-hidden">
                                <img src={song.thumbnail_uri} className="h-10 w-10 rounded shrink-0" alt="" />
                                <div className="flex flex-col truncate">
                                    <span className={`font-medium truncate ${currentSong?._id === song._id ? 'text-spotify-green' : 'text-white'}`}>
                                        {song.title}
                                    </span>
                                </div>
                            </div>

                            <span className="text-spotify-text-muted text-sm truncate hidden md:block group-hover:text-white">
                                {song.artist?.username}
                            </span>

                            <div className="flex justify-end items-center gap-4 relative">
                                <Heart size={16} fill="#1db954" className="text-spotify-green shrink-0" />
                                <span className="text-spotify-text-muted text-sm w-10 text-right">3:45</span>

                                {/* 👈 Drop in the Smart Menu! */}
                                <SongMenu
                                    song={song}
                                    playlists={playlists}
                                    onAddToPlaylist={handleAddToPlaylist}
                                    onRemoveLike={handleRemoveLike}
                                    context="liked"
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LikedSongsPage;