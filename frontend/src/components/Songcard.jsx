import { Play, Heart, MoreVertical, Plus } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePlaylists } from '../context/PlaylistContext';
import { playlistService } from '../services/playlist.service';

const SongCard = ({ song }) => {
  const queryClient = useQueryClient();
  const { playSong } = usePlayer();
  const { user } = useAuth();

  const { playlists, refreshPlaylists } = usePlaylists();

  const [isLiked, setIsLiked] = useState(song.likes?.includes(user?._id));
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null); // Used to detect clicks outside the menu

  // Close the menu if the user clicks anywhere else on the screen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/music/togglelike/${song._id}`);
      setIsLiked(res.data.isLiked);

      queryClient.invalidateQueries({ queryKey: ["allSongs"] });
      queryClient.invalidateQueries({ queryKey: ["searchSongs"] });
      queryClient.invalidateQueries({ queryKey: ['likedSongs'] });
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  // 👈 4. The function to actually add the song to the chosen playlist
  const handleAddToPlaylist = async (e, playlistId) => {
    e.stopPropagation();
    try {
      const res = await playlistService.addSong(playlistId, song._id);
      if (res.success) {
        alert(`Added to playlist!`); // You can replace this with a nice toast notification later
        setShowMenu(false);
        refreshPlaylists(); // Instantly update the song count in the Sidebar
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add song");
    }
  };

  return (
    <div className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-all group cursor-pointer relative">
      <div className="relative mb-4 aspect-square">
        <img src={song.thumbnail_uri} alt="" className="object-cover w-full h-full rounded shadow-lg" />

        {/* Play Button */}
        <div
          onClick={(e) => { e.stopPropagation(); playSong(song); }}
          className="absolute bottom-2 right-2 bg-spotify-green p-3 rounded-full shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:scale-105"
        >
          <Play className="text-black fill-black" size={24} />
        </div>

        {/* Heart Button - Moved slightly to the left to make room for the menu */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-10 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart
            size={20}
            className={`${isLiked ? 'fill-red-600 text-red-600' : 'text-gray-400 hover:text-white'}`}
          />
        </button>

        {/* 👈 5. "Three Dots" Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical size={20} className="text-gray-400 hover:text-white" />
        </button>

        {/* 👈 6. The Dropdown Menu */}
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute right-2 top-10 w-48 bg-[#282828] shadow-2xl rounded-md z-50 py-2 border border-white/10"
            onClick={(e) => e.stopPropagation()} // Prevent closing immediately when clicking inside
          >
            <p className="text-[10px] font-bold text-gray-400 px-4 mb-2 uppercase tracking-wider">Add to playlist</p>
            <div className="max-h-40 overflow-y-auto custom-scrollbar">
              {playlists.length === 0 ? (
                <p className="text-xs text-gray-500 px-4 py-2">No playlists found</p>
              ) : (
                playlists.map(p => (
                  <button
                    key={p._id}
                    onClick={(e) => handleAddToPlaylist(e, p._id)}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm text-gray-200 flex items-center gap-2 transition"
                  >
                    <Plus size={14} className="shrink-0" />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <h3 className="text-white font-bold truncate mb-1">{song.title}</h3>
      <p className="text-spotify-text-muted text-sm truncate">{song.artist?.username || "Unknown"}</p>
    </div>
  );
};

export default SongCard;