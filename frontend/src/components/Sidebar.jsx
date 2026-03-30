import { Home, Search, Library, Plus, Heart, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CreatePlaylistModal from './CreatePlaylistModal'; 
import UploadMusicModal from './UploadMusicModal';
import { useAuth } from '../context/AuthContext';
import PlaylistImage from './PlaylistImage';
import { usePlaylists } from '../context/PlaylistContext';

const Sidebar = () => {
    const { user } = useAuth();
    
    const { playlists, refreshPlaylists } = usePlaylists(); 
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handlePlaylistCreated = () => {
        refreshPlaylists(); 
    };

    return (
        <div className="w-[300px] flex flex-col gap-2 h-full p-2">

            <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-4">
                <Link to="/" className="flex items-center gap-4 text-gray-400 hover:text-white transition font-bold">
                    <Home size={24} />
                    <span>Home</span>
                </Link>
                <Link to="/search" className="flex items-center gap-4 text-gray-400 hover:text-white transition font-bold">
                    <Search size={24} />
                    <span>Search</span>
                </Link>
                <Link to="/liked" className="flex items-center gap-4 group cursor-pointer py-2 hover:bg-[#282828] rounded-md transition-all">
                    <div className="bg-gradient-to-br from-indigo-700 to-blue-300 p-1 rounded-sm shadow-lg">
                        <Heart size={16} fill="white" className="text-white" />
                    </div>
                    <span className="font-bold text-gray-300 group-hover:text-white transition-colors ml-4">Liked Songs</span>
                </Link>

                {user?.role === 'artist' && (
                    <button 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-4 group cursor-pointer py-2 hover:bg-[#282828] rounded-md transition-all text-left"
                    >
                        <div className="bg-[#282828] p-1 rounded-sm group-hover:bg-white transition-colors flex items-center justify-center">
                            <Upload size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                        </div>
                        <span className="font-bold text-gray-300 group-hover:text-white transition-colors ml-4">Upload Music</span>
                    </button>
                )}
            </div>

            <div className="bg-[#121212] rounded-lg flex-1 p-4 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Library size={24} />
                        <span className="font-bold">Your Library</span>
                    </div>
                    <Plus
                        size={20}
                        className="text-gray-400 hover:text-white cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    />
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar">

                    {user && playlists.length === 0 && (
                        <div className="bg-[#242424] p-4 rounded-lg flex flex-col gap-2">
                            <p className="font-bold text-sm text-white">Create your first playlist</p>
                            <p className="text-xs text-white">It's easy, we'll help you</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-white text-black text-xs font-bold py-2 px-4 rounded-full w-fit hover:scale-105 transition"
                            >
                                Create playlist
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        {playlists.map((playlist) => (
                            <Link
                                key={playlist._id}
                                to={`/playlist/${playlist._id}`}
                                className="flex items-center gap-3 p-2 hover:bg-[#1a1a1a] rounded-md transition group"
                            >
                                <div className="w-12 h-12 rounded overflow-hidden shadow-lg shrink-0">
                                    <PlaylistImage src={playlist.thumbnail} name={playlist.name} size={20} />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-white font-medium truncate">{playlist.name}</span>
                                    <span className="text-gray-400 text-xs">Playlist • {playlist.musics?.length || 0} songs</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <CreatePlaylistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPlaylistCreated={handlePlaylistCreated}
            />

            <UploadMusicModal 
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </div>
    );
};

export default Sidebar;