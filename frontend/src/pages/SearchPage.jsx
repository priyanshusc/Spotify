import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/api';
import SongCard from '../components/Songcard';
import { Search as SearchIcon, X } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import ArtistCard from '../components/ArtistCard';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const { setQueue } = usePlayer();

    const handleClear = () => {
        setSearchTerm("");
        setDebouncedSearchTerm("");
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: results, isLoading } = useQuery({
        queryKey: ['searchSongs', debouncedSearchTerm],
        queryFn: async () => {
            if (!debouncedSearchTerm) return { artists: [], songs: [] };
            const res = await api.get(`/music/search?query=${debouncedSearchTerm}`);
            return res.data.data;
        },
        enabled: debouncedSearchTerm.length > 0,
    });

    useEffect(() => {
        if (results && results?.songs?.length > 0) {
            setQueue(results?.songs);
        }
    }, [results, setQueue]);

    return (
        <div className="min-h-screen pb-20">
            {/* 1. Sticky Search Header */}
            <div className="sticky top-0 z-10 py-4 -mx-4 px-4 mb-6">
                <div className="relative max-w-md group">
                    <SearchIcon
                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchTerm ? 'text-white' : 'text-gray-400'
                            }`}
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="What do you want to listen to?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#242424] hover:bg-[#2a2a2a] border-none rounded-full py-3 pl-12 pr-12 
                                 text-white text-sm focus:ring-2 focus:ring-white outline-none transition-all
                                 placeholder:text-gray-500"
                    />
                    {searchTerm && (
                        <button
                            onClick={handleClear}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Dynamic Title */}
            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">
                {searchTerm ? `Top results for "${searchTerm}"` : "Browse All"}
            </h2>

            {/* 3. The Content Area */}
            {isLoading ? (
                // Skeleton Loader Grid
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-[#181818] p-4 rounded-lg animate-pulse">
                            <div className="aspect-square bg-[#282828] rounded-md mb-4" />
                            <div className="h-4 bg-[#282828] rounded w-3/4 mb-2" />
                            <div className="h-3 bg-[#282828] rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-10">

                        {/* 🎙️ ARTISTS SECTION (Only show if results exist) */}
                        {results?.artists?.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">Artists</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {results.artists.map(artist => (
                                        <ArtistCard key={artist._id} artist={artist} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 🎵 SONGS SECTION */}
                        {results?.songs?.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {results.songs.map(song => (
                                        <SongCard key={song._id} song={song} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* --- Empty State logic --- */}
                    </div>

                    {/* Enhanced Empty State */}
                    {results?.length === 0 && searchTerm && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-[#242424] p-6 rounded-full mb-4">
                                <SearchIcon size={48} className="text-gray-500" />
                            </div>
                            <h3 className="text-white text-xl font-bold">No results found for "{searchTerm}"</h3>
                            <p className="text-gray-400 mt-2">Please make sure your words are spelled correctly or use fewer keywords.</p>
                        </div>
                    )}

                    {/* Optional: "Browse All" Categories when not searching */}
                    {!searchTerm && results?.length === 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {['Pop', 'Hip-Hop', 'Rock', 'Latin', 'Indie', 'Jazz'].map((genre) => (
                                <div
                                    key={genre}
                                    className="h-32 rounded-lg p-4 font-bold text-xl cursor-pointer hover:brightness-110 transition-all"
                                    style={{ backgroundColor: `hsl(${Math.random() * 360}, 60%, 40%)` }}
                                >
                                    {genre}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
};

export default SearchPage;