import { useState } from 'react';
import { MoreVertical, Plus, ChevronRight, Share, Radio, User, MinusCircle, Search } from 'lucide-react';
import { useFloating, autoUpdate, offset, flip, shift, useDismiss, useInteractions, useClick } from '@floating-ui/react';

const SongMenu = ({ song, playlists = [], onAddToPlaylist, onRemoveFromPlaylist, onRemoveLike, context: menuContext }) => {
    const [isOpen, setIsOpen] = useState(false);

    // --- Floating UI Configuration ---
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: 'bottom-end',
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(4),
            flip({ fallbackPlacements: ['top-end'] }),
            shift({ padding: 8 })
        ],
    });

    // Handle clicks outside the menu to close it
    const click = useClick(context);
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

    return (
        <>
            {/* --- Trigger Button --- */}
            <button
                ref={refs.setReference}
                {...getReferenceProps()}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`p-1 hover:text-white transition-opacity ${isOpen ? 'text-white opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`}
            >
                <MoreVertical size={18} />
            </button>

            {/* --- The Smart Floating Menu --- */}
            {isOpen && (
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                    className="w-60 bg-[#282828] shadow-2xl rounded-md z-[100] p-1 border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 1. REMOVE FROM LIKED SONGS (Only shows on Liked Page) */}
                    {menuContext === 'liked' && (
                        <>
                            <button
                                onClick={(e) => {
                                    if (onRemoveLike) onRemoveLike(e, song._id);
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-sm text-sm text-gray-200 flex items-center gap-3 transition"
                            >
                                <MinusCircle size={16} className="text-gray-400" />
                                <span>Remove from Liked Songs</span>
                            </button>
                            <div className="h-[1px] bg-white/10 my-1 mx-2"></div>
                        </>
                    )}

                    {/* 2. ADD TO PLAYLIST (Shows on Home/Search/Liked, hides on Playlist Page) */}
                    {menuContext !== 'playlist' && (
                        <div className="relative group/submenu">
                            <button className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-sm text-sm text-gray-200 flex items-center justify-between transition">
                                <div className="flex items-center gap-3">
                                    <Plus size={16} className="text-gray-400" />
                                    <span>Add to playlist</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>

                            {/* The Nested Submenu (Pops out to the LEFT) */}
                            <div className="absolute right-full top-0 mr-1 w-64 bg-[#282828] shadow-2xl rounded-md border border-white/10 hidden group-hover/submenu:flex flex-col py-1 z-[110]">

                                <div className="px-2 py-2">
                                    <div className="bg-white/10 rounded-sm flex items-center px-2 py-1.5 gap-2">
                                        <Search size={14} className="text-gray-400" />
                                        <input type="text" placeholder="Find a playlist" className="bg-transparent border-none text-xs text-white outline-none w-full placeholder:text-gray-400" />
                                    </div>
                                </div>

                                <button className="w-full text-left px-3 py-2 hover:bg-white/10 text-sm text-gray-200 flex items-center gap-3 transition">
                                    <Plus size={16} className="text-gray-400" />
                                    <span className="font-medium">New playlist</span>
                                </button>

                                <div className="h-[1px] bg-white/10 my-1 mx-2"></div>

                                {/* Actual Playlists List */}
                                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                    {playlists.map(p => (
                                        <button
                                            key={p._id}
                                            onClick={(e) => {
                                                if (onAddToPlaylist) onAddToPlaylist(e, p._id, song._id);
                                                setIsOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2.5 hover:bg-white/10 text-sm text-gray-200 transition truncate"
                                        >
                                            {p.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. REMOVE FROM PLAYLIST (Only shows on Playlist Page) */}
                    {menuContext === 'playlist' && (
                        <button
                            onClick={(e) => {
                                if (onRemoveFromPlaylist) onRemoveFromPlaylist(e, song._id);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-sm text-sm text-red-500 flex items-center gap-3 transition"
                        >
                            <MinusCircle size={16} className="text-red-500" />
                            <span>Remove from this playlist</span>
                        </button>
                    )}

                    {/* --- COMMON ITEMS (Shows Everywhere) --- */}
                    <button className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-sm text-sm text-gray-200 flex items-center gap-3 transition mt-1">
                        <Radio size={16} className="text-gray-400" />
                        <span>Go to song radio</span>
                    </button>
                    <button className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-sm text-sm text-gray-200 flex items-center gap-3 transition">
                        <User size={16} className="text-gray-400" />
                        <span>Go to artist</span>
                    </button>
                    <button className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-sm text-sm text-gray-200 flex items-center gap-3 transition">
                        <Share size={16} className="text-gray-400" />
                        <span>Share</span>
                    </button>
                </div>
            )}
        </>
    );
};

export default SongMenu;