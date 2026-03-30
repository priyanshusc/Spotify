import { Play, Heart, Pause } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePlaylists } from '../context/PlaylistContext';
import { playlistService } from '../services/playlist.service';
import { toast } from 'sonner';
import SongMenu from './SongMenu'; // Using your professional menu component

const SongCard = ({ song }) => {
  const queryClient = useQueryClient();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { user } = useAuth();
  const { playlists, refreshPlaylists } = usePlaylists(); // Restored refreshPlaylists

  // Initializing liked state correctly from your original logic
  const [isLiked, setIsLiked] = useState(song.likes?.includes(user?._id));
  const isCurrent = currentSong?._id === song._id;

  // Keep state in sync if song data changes
  useEffect(() => {
    setIsLiked(song.likes?.includes(user?._id));
  }, [user?._id, song.likes]);

  // RESTORED: Your original handleLike logic with correct endpoint and toasts
  const handleLike = async (e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.post(`/music/togglelike/${song._id}`);
      toast.success(res.data.message);
      setIsLiked(res.data.isLiked);

      // Correct Query Keys from your original code
      queryClient.invalidateQueries({ queryKey: ["allSongs"] });
      queryClient.invalidateQueries({ queryKey: ["searchSongs"] });
      queryClient.invalidateQueries({ queryKey: ['likedSongs'] });
    } catch (err) {
      console.error("Like failed", err);
      toast.error(err.response?.data?.message || "Failed to like song");
    }
  };

  // RESTORED: Your original Add to Playlist logic with correct service method
  const handleAddToPlaylist = async (e, playlistId) => {
    try {
      const res = await playlistService.addSong(playlistId, song._id);
      if (res.success) {
        toast.success(`Added to playlist!`);
        refreshPlaylists(); // Updates Sidebar count instantly
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add song");
    }
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  return (
    /* UI: Increased card size and premium hover effects */
    <div className="group bg-[#181818] hover:bg-[#282828] p-3 rounded-md transition-all duration-300 w-48 flex-shrink-0 cursor-pointer relative border border-transparent hover:border-white/5 shadow-lg">

      <div className="relative aspect-square mb-4">
        <img
          src={song.thumbnail_uri}
          alt={song.title}
          className="w-full h-full object-cover rounded shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
        />

        {/* Play Button Overlay */}
        <button
          onClick={handlePlay}
          className={`absolute bottom-2 right-2 p-3 bg-[#1ed760] rounded-full text-black shadow-2xl transform transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105 active:scale-95 ${isCurrent && isPlaying ? 'opacity-100 translate-y-0' : ''}`}
        >
          {isCurrent && isPlaying ? <Pause fill="black" size={24} /> : <Play fill="black" size={24} />}
        </button>
      </div>

      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold truncate text-base mb-1">{song.title}</h3>
          <p className="text-[#b3b3b3] text-sm truncate hover:underline hover:text-white transition-colors">
            {song.artist?.username || "Unknown Artist"}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          {/* Better Menu: Integrated your cascading SongMenu */}
          <SongMenu
            song={song}
            playlists={playlists}
            onAddToPlaylist={handleAddToPlaylist}
            onRemoveLike={handleLike} // Pass handleLike so user can unlike from menu too
            context="default"
          />

          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`transition-all duration-200 transform hover:scale-110 ${isLiked ? 'text-[#1ed760]' : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white'}`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;