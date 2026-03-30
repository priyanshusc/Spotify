import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Added useQueryClient
import api from '../api/api';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext'; // Added useAuth
import { Play, CheckCircle } from 'lucide-react';
import SongMenu from '../components/SongMenu';
import { usePlaylists } from '../context/PlaylistContext';
import { playlistService } from '../services/playlist.service';
import { toast } from 'sonner';
import { useState, useEffect } from 'react'; // Added hooks

const ArtistPage = () => {

    const { artistId } = useParams();
    const queryClient = useQueryClient(); // For refreshing data
    const { user } = useAuth(); // Get current user
    const { playSong, setQueue, currentSong, isPlaying } = usePlayer();
    const { playlists, refreshPlaylists } = usePlaylists();

    const [isFollowing, setIsFollowing] = useState(false);

    // Fetch Artist Profile
    const { data: artist, isLoading, error } = useQuery({
        queryKey: ['artistProfile', artistId],
        queryFn: async () => {
            const res = await api.get(`/user/artist/profile/${artistId}`);
            return res.data.data;
        }
    });

    // Determine if the current user is already following this artist
    useEffect(() => {
        if (user && user.following) {
            // Check if artistId exists in the user's following array
            const followingIds = user.following.map(id => id.toString());
            setIsFollowing(followingIds.includes(artistId));
        }
    }, [user, artistId]);

    // --- 🚀 NEW: Handle Follow/Unfollow Logic ---
    const handleFollowToggle = async () => {
        if (!user) return toast.error("Please login to follow artists");

        try {
            if (isFollowing) {
                // Assuming your route is POST /api/user/unfollow/:id
                const res = await api.post(`/user/unfollow/${artistId}`);
                setIsFollowing(false);
                toast.success(res.data.message);
            } else {
                // Assuming your route is POST /api/user/follow/:id
                const res = await api.post(`/user/follow/${artistId}`);
                setIsFollowing(true);
                toast.success(res.data.message);
            }
            
            // Refresh the artist profile to update follower count instantly
            queryClient.invalidateQueries(['artistProfile', artistId]);
            // Refresh the user profile so the 'following' array is updated globally
            queryClient.invalidateQueries(['authUser', 'userFullProfile']); 
            
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        }
    };

    const handleAddToPlaylist = async (e, playlistId, songId) => {
        e.stopPropagation();
        try {
            const res = await playlistService.addSong(playlistId, songId);
            if (res.success) {
                toast.success('Song added to playlist!');
                refreshPlaylists();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add song");
        }
    };

    if (isLoading) return <div className="p-8 text-white animate-pulse text-lg">Loading Profile...</div>;

    if (error || !artist) return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold">Artist not found</h2>
            <p className="text-gray-400 mt-2">This user might not have an artist profile.</p>
        </div>
    );

    // Check if the logged-in user is viewing their own artist page
    const isOwnProfile = user && (user._id === artistId || user.id === artistId);

    return (
        <div className="flex-1 bg-gradient-to-b from-[#535353] to-spotify-black overflow-y-auto min-h-full -mt-6 -mx-6">

            {/* --- 1. Artist Hero Banner --- */}
            <div className="flex items-end gap-6 p-8 h-80 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.5)]">
                <img
                    src={artist.profilePicture || "https://via.placeholder.com/150"}
                    className="w-52 h-52 rounded-full shadow-2xl object-cover border-4 border-white/10"
                    alt={artist.username}
                />
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={20} className="text-white fill-blue-400" />
                        <span className="text-sm font-bold text-white uppercase tracking-widest">Verified Artist</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white">{artist.username}</h1>
                    <div className='flex items-center gap-2 text-white text-sm font-medium mt-2'>
                        {/* Optionally display follower count here to see it update instantly! */}
                        <span>{artist.followers?.length || 0} Followers</span>
                        <span className="w-1 h-1 rounded-full bg-white/50"></span>
                        <span>{artist.musics?.length || 0} song{artist.musics?.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>

            {/* --- 2. Action Bar --- */}
            <div className="p-8 flex items-center gap-6">
                <button
                    onClick={() => {
                        if (artist.musics?.length > 0) {
                            setQueue(artist.musics); 
                            playSong(artist.musics[0]); 
                        }
                    }}
                    className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg active:scale-95"
                >
                    <Play fill="black" className="text-black ml-1" size={28} />
                </button>
                
                {/* --- 🚀 DYNAMIC FOLLOW BUTTON --- */}
                {!isOwnProfile && (
                    <button 
                        onClick={handleFollowToggle}
                        className={`px-8 py-2 rounded-full border font-bold text-sm transition-all duration-300
                            ${isFollowing 
                                ? 'border-white text-white hover:border-red-500 hover:text-red-500 hover:bg-red-500/10' // Unfollow hover state
                                : 'border-gray-500 text-white hover:border-white hover:scale-105' // Standard follow state
                            }
                        `}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                )}
            </div>

            {/* --- 3. Discography Section --- */}
            <div className="px-8 pb-20">
                <h2 className="text-2xl font-bold text-white mb-6">Popular Tracks</h2>

                {!artist.musics || artist.musics.length === 0 ? (
                    <p className="text-gray-500 italic">This artist hasn't uploaded any music yet.</p>
                ) : (
                    <div className="flex flex-col">
                        {artist.musics.map((song, index) => (
                            <div
                                key={song._id}
                                onClick={() => {
                                    setQueue(artist.musics);
                                    playSong(song);
                                }}
                                className={`grid grid-cols-[16px_4fr_120px] gap-4 px-4 py-3 rounded-md hover:bg-white/10 transition group cursor-pointer items-center
                                    ${currentSong?._id === song._id ? 'text-spotify-green' : 'text-white'}`}
                            >
                                {/* Index / Speaker Animation */}
                                <span className="text-spotify-text-muted text-sm flex justify-center">
                                    {currentSong?._id === song._id && isPlaying ? (
                                        <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" alt="playing" className="w-3 h-3" />
                                    ) : index + 1}
                                </span>

                                {/* Song Info */}
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <img src={song.thumbnail_uri} className="h-10 w-10 rounded shadow-md object-cover" alt="" />
                                    <span className={`font-medium truncate ${currentSong?._id === song._id ? 'text-spotify-green' : 'text-white'}`}>
                                        {song.title}
                                    </span>
                                </div>

                                {/* Duration & Menu */}
                                <div className="flex justify-end items-center gap-4 relative">
                                    <span className="text-spotify-text-muted text-sm group-hover:text-white transition-colors">3:45</span>
                                    <SongMenu
                                        song={song}
                                        playlists={playlists}
                                        onAddToPlaylist={handleAddToPlaylist}
                                        context="artist"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtistPage;