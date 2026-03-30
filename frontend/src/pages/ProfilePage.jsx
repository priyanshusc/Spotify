import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlaylists } from '../context/PlaylistContext';
import { User, Music, Plus, Heart, Mic2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import SongCard from '../components/Songcard';
import PlaylistImage from '../components/PlaylistImage';

const ProfilePage = () => {
    const { user } = useAuth(); // Full user object from /user/profile
    const { playlists, refreshPlaylists } = usePlaylists();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isArtist = user?.role === 'artist';

    const myPlaylists = playlists || [];

    const artistSongs = user?.musics || [];
    const totalLikesReceived = artistSongs.reduce((acc, song) => acc + (song.likes?.length || 0), 0);

    return (
        <div className="flex flex-col min-h-full bg-[#121212] text-white">
            {/* --- Hero Header Section --- */}
            <header className={`relative flex items-end p-8 pt-20 min-h-[350px] bg-gradient-to-b ${isArtist ? 'from-emerald-900/80' : 'from-zinc-800/80'} to-[#121212]`}>
                <div className="flex items-end gap-8 z-10 w-full">
                    <div className="shrink-0">
                        {user?.profilePicture ? (
                            <img
                                src={typeof user.profilePicture === 'string' ? user.profilePicture : user.profilePicture?.url}
                                alt={user.username}
                                className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border border-white/5 shadow-2xl"
                            />
                        ) : (
                            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-[#282828] flex items-center justify-center shadow-2xl">
                                <User size={100} className="text-zinc-500" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-xs flex items-center gap-2 font-bold uppercase tracking-[0.2em]">
                            {isArtist ? <><CheckCircle size={20} className="text-white fill-blue-400" />Verified Artist</> : 'Profile'}
                        </span>
                        <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-4">
                            {user?.username}
                        </h1>

                        <div className="flex items-center gap-2 text-sm font-bold text-white/90">
                            <span>{user?.following?.length || 0} Following</span>

                            {isArtist ? (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-white/40 mx-1"></span>
                                    <span>{user?.followers?.length || 0} Followers</span>
                                    <span className="w-1 h-1 rounded-full bg-white/40 mx-1"></span>
                                    <span className="flex items-center gap-1">
                                        <Heart size={14} fill="white" /> {totalLikesReceived} Total Likes
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-white/40 mx-1"></span>
                                    <span className="flex items-center gap-1">
                                        <Heart size={14} fill="white" /> {user?.likedSongs?.length || 0} Liked Songs
                                    </span>
                                </>
                            )}

                            <span className="w-1 h-1 rounded-full bg-white/40 mx-1"></span>
                            <span className="text-zinc-400 font-medium">{myPlaylists.length} Playlists</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-8 space-y-12">
                {isArtist && (
                    <section>
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <Mic2 className="text-emerald-500" /> Your Uploads
                        </h2>
                        {artistSongs.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                                {artistSongs.map(song => (
                                    <SongCard key={song._id} song={song} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-500 italic">No songs uploaded yet.</p>
                        )}
                    </section>
                )}

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black">Your Playlists</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition group"
                        >
                            <Plus size={20} className="group-hover:scale-110 transition-transform" />
                            Create Playlist
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                        {myPlaylists.length > 0 ? (
                            myPlaylists.map(playlist => (
                                <Link
                                    key={playlist._id}
                                    to={`/playlist/${playlist._id}`}
                                    className="group bg-[#181818] hover:bg-[#282828] p-4 rounded-xl transition-all shadow-md"
                                >
                                    {/* The container is already aspect-square and rounded */}
                                    <div className="aspect-square mb-4 shadow-lg rounded-lg overflow-hidden bg-[#232323]">
                                        {/* FIX: Removed the w-12 h-12 wrapper.
         PlaylistImage now takes w-full h-full from the parent.
         Increased size to 48 for a better fallback icon look.
      */}
                                        <PlaylistImage
                                            src={playlist.thumbnail}
                                            name={playlist.name}
                                            size={48}
                                            className="group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    <h3 className="font-bold truncate mb-1 text-base">{playlist.name}</h3>
                                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Playlist</p>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-[#181818]/40 rounded-2xl border border-dashed border-white/5">
                                <p className="text-zinc-500 font-medium">No playlists found. Create your first one!</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Modal remains triggered by 'isOpen' prop */}
            <CreatePlaylistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPlaylistCreated={() => {
                    refreshPlaylists();
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
};

export default ProfilePage;